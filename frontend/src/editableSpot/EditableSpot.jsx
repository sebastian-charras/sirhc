import { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import axios from 'axios';
import { baseUrl } from '../api/url/url';

const queryClient = new QueryClient();

export function EditableSpot({ initialSpot }) {
    const [spot, setSpot] = useState(initialSpot);
    const saveSpot = useMutation({
        mutationFn: spot => {
            axios.put(baseUrl + 'spots/' + spot._id, spot)
            queryClient.invalidateQueries('spots');
        }
    }).mutate;
    const deleteSpot = useMutation({
        mutationFn: spot => {
            axios.delete(baseUrl + 'spots/' + spot._id)
            queryClient.invalidateQueries('spots');
        }
    }).mutate;

    function handleNameChange(e) {
        setSpot({
            ...spot,
            name: e.target.value
        });
    }

    function handleAvailabilityChange() {
        setSpot({
            ...spot,
            available: !spot.available
        })
    }

    function handleSave() {
        saveSpot(spot);
    }

    function handleDelete() {
        deleteSpot(spot);
        queryClient.invalidateQueries('spots');
    }

    return (
        <div data-testid='editableSpot'>
            <label htmlFor={'name' + spot._id}>Número de puesto</label>
            <input id={'name' + spot._id} value={spot.name} onChange={e => handleNameChange(e)}></input>
            <label htmlFor={'availability' + spot._id}>¿Está libre?</label>
            <input id={'availability' + spot._id} type="checkbox" checked={spot.available} onChange={handleAvailabilityChange} />
            <button onClick={handleSave}>Guardar</button>
            <button onClick={handleDelete}>Eliminar</button>
        </div>
    );
}
