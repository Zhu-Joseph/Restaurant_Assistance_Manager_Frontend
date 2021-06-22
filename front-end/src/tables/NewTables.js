import React, {useState} from 'react'
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {validateTable} from "../utils/handlers"
import {createTable} from "../utils/api"

export default function NewTables() {
    const initialState = {
        "table_name": "",
        "capacity": 0,
        "occupied":false,
    }

    const history = useHistory()
    const [formData, setFormData] = useState({...initialState})
    const [error, setError] = useState(undefined)

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        const result = validateTable(formData)
 
        if(result) {
            createTable({data: formData}, abortController.signal)
            .then(() => {
                history.push("/dashboard")
            })
            .catch(setError)
        }
        return () => abortController.abort()
    }
    
    const handleChange = ({ target }) => {
        const value = target.value;
        setFormData({
          ...formData,
          [target.name]: value,
        })
    }

    const handleCapacity = ({ target }) => {
        let value = target.value
        if(value > 0 && !isNaN(Number(value[value.length - 1]))) {

            setFormData({
            ...formData,
            [target.name]: value,
            })
        } else {
            if(value.length === 0) {
                setFormData({
                    ...formData,
                    [target.name]: value,
                })
            }
        }
    }

    function cancelHandler() {
        
        history.goBack()
        setFormData(initialState)
    }

    if(error) {
        return (
            <ErrorAlert error={error} />
        )
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Table Name:</label>
                    <input name="table_name" type="text" 
                    onChange={handleChange} value={formData.table_name}/>
                </div>
                <div>
                    <label>Capacity:</label>
                    <input name="capacity" type="number" 
                    onChange={handleCapacity} value={formData.capacity} />
                </div>
                <button type="submit" onSubmit={submitHandler}>Submit</button>
            </form>
            <button onClick={cancelHandler}>Cancel</button>
        </div>
    )
}