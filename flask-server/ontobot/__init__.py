from flask import Flask, request, send_file, jsonify
from ontobot.model.output import Error, Response
from ontobot.services import taxonomy_service, op_service, populate_service
import requests, json

app = Flask(__name__)

# Global variables and methods
data = {}
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/onto/checkpoint_1/download')
def download_file():
    path = "../OWLfile.owl"
    return send_file(path, as_attachment=True)


@app.route('/onto/checkpoint_1/validate', methods=['POST'])
def add_ontos():
    return taxonomy_service.validate_taxonomy_service(request.get_json())

# validate
@app.route('/op/checkpoint_1/taxowl_generate/consistency', methods=['POST'])
def get_taxo_consistancy():
    data = request.get_json()
    url = 'http://localhost:8080/taxonomy/validate'
    headers = {'Content-Type': 'application/json'}
    result = taxonomy_service.get_taxonomy_owl(data)
    if result['code'] == 500:
        return Error.send_something_went_wrong_error(result['msg'])
    else:
        response = requests.post(url, data= Response.send_response(result['msg']), headers=headers)
        return Response.send_response(response.json()) 


# local testing
@app.route('/op/checkpoint_1/taxowl_generate', methods=['POST'])
def get_taxo_download_local():
    data = request.get_json()
    url = 'http://localhost:8080/taxonomy/generate'
    headers = {'Content-Type': 'application/json'}
    result = taxonomy_service.get_taxonomy_owl(data)
    if result['code'] == 500:
        return Error.send_something_went_wrong_error(result['msg'])
    else:
        return Response.send_response(result['msg'])

# local testing
@app.route('/op/checkpoint_1/op_generate', methods=['POST'])
def get_nAry_download_local():
    data = request.get_json()
    result = op_service.get_op_structure(data)
    if result['code'] == 500:
        if result['type'] == "op_relational":
            return Error.send_op_relational_error(result['msg'])
        elif result['type'] == "role":
            return Error.send_role_error(result['msg'])
        else:
            return Error.send_something_went_wrong_error(result['msg'])
    else:
        return Response.send_response(result['msg'])
    

# download
@app.route('/op/checkpoint_1/op_generate/download', methods=['POST'])
def get_nAry_download():
    data = request.get_json()
    url = 'http://localhost:8080/completed/generate'
    headers = {'Content-Type': 'application/json'}
    result = op_service.get_op_structure(data)
    if result['code'] == 500:
        if result['type'] == "op_relational":
            return Error.send_op_relational_error(result['msg'])
        elif result['type'] == "role":
            return Error.send_role_error(result['msg'])
        else:
            return Error.send_something_went_wrong_error(result['msg'])
    else:
        response = requests.post(url, data= Response.send_response(result['msg']), headers=headers)
        # Store OWL content in a file
        owl_content = response.content
        file_path = f"ontobot/files/owl/{data['sessionID']}.owl"
        with open(file_path, 'wb') as f:
            f.write(owl_content)

        return Response.send_response("Ontology has been generated")

# validate
@app.route('/op/checkpoint_1/op_generate/consistency', methods=['POST'])
def get_nAry_consistancy():
    data = request.get_json()
    url = 'http://localhost:8080/simpleOP/validate'
    headers = {'Content-Type': 'application/json'}
    result = op_service.get_op_structure(data)
    if result['code'] == 500:
        if result['type'] == "op_relational":
            return Error.send_op_relational_error(result['msg'])
        elif result['type'] == "role":
            return Error.send_role_error(result['msg'])
        else:
            return Error.send_something_went_wrong_error(result['msg'])
    else:
        response = requests.post(url, data= Response.send_response(result['msg']), headers=headers)
        return Response.send_response(response.json()) 
        

# local testing
@app.route('/op/checkpoint_1/populate', methods=['POST'])
def get_populate_local():
    return populate_service.get_excel_file(request.get_json())


# local testing
@app.route('/op/checkpoint_2/populate', methods=['POST'])
def add_populate_local():
    data = request.get_json()
    sessionID = data['sessionID']
    result = populate_service.convert_excel_file(sessionID)

    if result['code'] == 500:
        return Error.send_something_went_wrong_error(result['msg'])
    else:
        return Response.send_response(result['msg'])


# populate
@app.route('/op/checkpoint_2/taxowl/populate', methods=['POST'])
def add_populate():
    json_data = request.form['json']
    data = json.loads(json_data)
    sessionID = data['sessionID']
    url = 'http://localhost:8080/taxonomy/populate'
    headers = {'Content-Type': 'application/json'}
    
    if 'file' not in request.files:
        return Error.file_error('No file part')
    
    file = request.files['file']

    if file.filename == '':
        return Error.file_error('No selected file')
    
    if not allowed_file(file.filename):
        return Error.file_error('Invalid file extension')
    
    # filename = secure_filename(file.filename)
    file.save(f"ontobot/files/excel/filled-excel/{sessionID}.xlsx")
    result = populate_service.convert_excel_file(sessionID=sessionID)
    if result['code'] == 500:
        return Error.send_something_went_wrong_error(result['msg'])
    else:
        response = requests.post(url, data= Response.send_response(result['msg']), headers=headers)
        return Response.send_response(response.json())


# testing for new data structure
@app.route('/op/checkpoint/op_generate/populate/test', methods=['POST'])
def test_ds():
    data = request.get_json()
    return op_service.test_data_structure(parsed_json=data)


    

if __name__ == "__main__":
    app.run()
