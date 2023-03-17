import xlsxwriter
import pandas as pd
from ontobot.services import firestore_connect
from ontobot.model.output import Error, Response
from ontobot.utils import cmethod

def get_excel_file(parsed_json):
    sessionID = parsed_json['sessionID']
    definedConcepts = []; definedConcepts.clear()
    try:
        owlTaxo = firestore_connect.get_OwlTaxo_document(session_id=sessionID)
        if owlTaxo is not None:
            taxonomy = owlTaxo['taxonomy']
            for taxo in taxonomy:
                concept = taxo['class_name']
                dps = taxo['attributes']
                obj = {
                    "key" : concept
                }
                att_obj = {}; att_obj.clear()

                if not __is_available(obj, definedConcepts):
                    for dp in dps:
                        att_obj[dp['name']] = {
                            "type" : dp['datatype'],
                            "restrictions" : dp['restrictions'],
                            "functional" :  dp['functional']
                        }
                    
                    obj['attributes'] = att_obj.copy()
                    
                    definedConcepts.append(obj)
                
                else:
                    fetched_concept = __find_concept(obj, definedConcepts)
                    att_obj = fetched_concept['attributes']

                if 'sub_classes' in taxo and len(taxo['sub_classes']) > 0:
                    for subTaxo in taxo['sub_classes']:
                        sobj = {
                            "key" : subTaxo['class_name']
                        }

                        if __is_available(sobj, definedConcept=definedConcepts):
                            fetched_concept = __find_concept(sobj, definedConcepts)
                            sobj['attributes'] = fetched_concept['attributes']
                        else:
                            sobj['attributes'] = att_obj.copy()
                        
                        for sdp in  subTaxo['attributes']:
                            sobj['attributes'][sdp['name']] = {
                                "type" : sdp['datatype'],
                                "restrictions" : sdp['restrictions'],
                                "functional" :  sdp['functional']
                            }
                        
                        definedConcepts.append(sobj)
                
            __generate_excel_file(data=definedConcepts, sessionID=sessionID)
            
            return Response.send_response(definedConcepts)
        
        else:
            return Error.send_something_went_wrong_error("No session data is found")

    except:
        return Error.send_something_went_wrong_error("object mapping issue happened")
    

def convert_excel_file(sessionID):
    # Get previous dataset from the database with respect to the session ID
    complete_content = firestore_connect.get_owlComplete_document(session_id=sessionID)
    complete_content_fix = {
        "sessionID": complete_content['sessionID'],
        "taxonomy" : complete_content['taxonomy'],
        "concepts" : complete_content['concepts'],
        "op" : complete_content['op']
    }
    converted_result = cmethod.convertFromTaxonomyContent(complete_content_fix)

    # Read the Excel file
    df = pd.read_excel(f'ontobot/files/excel/filled-excel/{sessionID}.xlsx', sheet_name=None)

    # Initialize the object array
    obj_arr = {}

    try:
        # Loop through each sheet in the Excel file
        for sheet_name in df.keys():
            # Initialize a list to store the data for the current sheet
            data = []
            # Loop through each row in the sheet
            for index, row in df[sheet_name].iterrows():
                # Initialize a dictionary to store the current row data
                row_data = {}
                # Loop through each column in the row
                for column_name in df[sheet_name].columns:
                    # Add the column data to the row dictionary
                    row_data[column_name.split("(")[0].strip()] = row[column_name]
    
                # Add the row dictionary to the sheet data list
                data.append(row_data)
            # Add the sheet data list to the object array with the sheet name as key
            obj_arr[sheet_name] = data

        firestore_connect.create_new_taxo_populate_document(session_id=sessionID, obj={
            "sessionID": sessionID,
            "populate": obj_arr
        })
        converted_result['populate'] = obj_arr
        
        return Response.next(converted_result)
    
    except:
        return Error.next("Something went wrong in excel file reading")


def __is_available(obj, definedConcept):
    for concept in definedConcept:
        if concept['key'] == obj['key']:
            return True
    
    return False

def __find_concept(obj, definedConcept):
    for concept in definedConcept:
        if concept['key'] == obj['key']:
            return concept

def __generate_excel_file(data, sessionID):
    try:
       # Create a new Excel workbook
        file_name = f"ontobot/files/excel/{sessionID}.xlsx"
        workbook = xlsxwriter.Workbook(filename=file_name)

        # Define formats for different data types
        int_format = workbook.add_format({'num_format': '0'})
        float_format = workbook.add_format({'num_format': '0.00'})
        string_format = workbook.add_format({'text_wrap': True})
        date_format = workbook.add_format({'num_format': 'dd/mm/yyyy'})
        bold = workbook.add_format({'bold': True})

        # Loop through each object in the data array
        for obj in data:
            # Create a new worksheet with the object's key as the name
            worksheet = workbook.add_worksheet(obj['key'])

        # Write the column headers to the worksheet and adjust the column widths
            col = 1
            worksheet.set_column(0, 0, 15)
            worksheet.write(0, 0, "# Object Name", bold)
            for attr in obj['attributes']:
                col_name = f"{attr} ({obj['attributes'][attr]['type']})"
                col_width = len(col_name) + 2
                worksheet.set_column(col, col, col_width)
                worksheet.write(0, col, col_name, bold)

                data_type = obj['attributes'][attr]['type']
                if data_type == "integer":
                    worksheet.set_column(col, col,col_width, int_format)
                elif data_type == "float":
                    worksheet.set_column(col, col,col_width, float_format)
                elif data_type == "string":
                    worksheet.set_column(col, col,col_width, string_format)
                elif data_type == "datetime":
                    worksheet.set_column(col, col,col_width, date_format)
                
                col += 1

            worksheet.freeze_panes(1, 0)
            

        # Close the workbook
        workbook.close()

    except Exception as err:
        return Error.send_something_went_wrong_error(err)