import React, { useState } from 'react'
import Select from "react-select";
import { useDispatch } from 'react-redux'

const SearchSelect = ({ optionList, isMultiSelect, reducerFunction, relationshipId, selectedChoice }) => {

    const [selectedOptions, setSelectedOptions] = useState(selectedChoice)
    const dispatch = useDispatch()

    const handleSelect = (data) => {
        setSelectedOptions(data)

        if (isMultiSelect) {
            dispatch(reducerFunction({
                data: data,
            }))
        }
        else {
            dispatch(reducerFunction({
                id: relationshipId,
                attribute: data.label,
            }))
        }
    }
    
    return (
        <Select
            options={optionList}
            placeholder="Select an option"
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={true}
            isMulti={isMultiSelect}
        />
    )
}

export default SearchSelect