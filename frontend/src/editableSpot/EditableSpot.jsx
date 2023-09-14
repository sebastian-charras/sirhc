import { useEffect, useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import axios from 'axios';
import { baseUrl } from '../api/url/url';
import { Button } from '@fluentui/react-components';

const queryClient = new QueryClient();

export function EditableSpot({ initialSpot }) {
    const serverSpot = initialSpot
    const [localSpot, setLocalSpot] = useState(serverSpot)
    const [isBeingEdited, setIsBeingEdited] = useState(false)
    const [saveProgressMessage, setSaveProgressMessage] = useState('')
    const [deleteProgressMessage, setDeleteProgressMessage] = useState('')
    const spot = isBeingEdited ? localSpot : serverSpot
    const saveSpotMutation = useMutation({
        mutationFn: spot => {
            axios.put(baseUrl + 'spots/' + spot._id, spot)
            queryClient.invalidateQueries('spots');
        }
    });
    const deleteSpotMutation = useMutation({
        mutationFn: spot => {
            axios.delete(baseUrl + 'spots/' + spot._id)
            queryClient.invalidateQueries('spots');
        }
    });

    useEffect(() => {
        let interval = null;
        if(saveSpotMutation.isError){
            setSaveProgressMessage('Ocurrió un error: ' + saveSpotMutation.error.message);
            interval = setInterval(() => {
                setSaveProgressMessage('');
            }, 10000)
        } else if(saveSpotMutation.isLoading){
            setSaveProgressMessage('Guardando...');
        } else if(saveSpotMutation.isSuccess){
            setSaveProgressMessage('Guardado');
            interval = setInterval(() => {
                setSaveProgressMessage('');
            }, 3000)
        }
        return () => {
            setSaveProgressMessage('');
            clearInterval(interval)
        }
    }, [saveSpotMutation.isError, saveSpotMutation.isLoading, saveSpotMutation.isSuccess])

    useEffect(() => {
        let interval = null;
        if(deleteSpotMutation.isError){
            setDeleteProgressMessage('Ocurrió un error: ' + deleteSpotMutation.error.message);
            interval = setInterval(() => {
                setDeleteProgressMessage('');
            }, 10000)
        } else if(deleteSpotMutation.isLoading){
            setDeleteProgressMessage('Eliminando...');
        } else if(deleteSpotMutation.isSuccess){
            setDeleteProgressMessage('Eliminado');
            interval = setInterval(() => {
                setDeleteProgressMessage('');
            }, 3000)
        }
        return () => {
            setDeleteProgressMessage('');
            clearInterval(interval)
        }
    }, [deleteSpotMutation.isError, deleteSpotMutation.isLoading, deleteSpotMutation.isSuccess])

    const saveSpot = () => {
        saveSpotMutation.mutate(spot)
    }
    const deleteSpot = () => {
        deleteSpotMutation.mutate(spot)
    }

    function handleNameChange(e) {
        setLocalSpot({
            ...spot,
            name: e.target.value
        });
    }

    function handleAvailabilityChange() {
        setLocalSpot({
            ...spot,
            available: !spot.available
        })
    }

    function handleEdit() {
        setIsBeingEdited(prev => !prev);
        setLocalSpot(serverSpot);
    }

    function handleSave() {
        saveSpot();
        setIsBeingEdited(false);
    }

    function handleDelete() {
        deleteSpot();
        setIsBeingEdited(false);
    }

    return (
        <div data-testid='editableSpot' className='my-5'>
            <label htmlFor={'name' + spot._id} className='mr-5'>Nombre del puesto:</label>
            <input disabled={!isBeingEdited} id={'name' + spot._id} value={spot.name} onChange={e => handleNameChange(e)} className='mx-2 py-1 px-3 rounded-md bg-sky-100'></input>
            <label htmlFor={'availability' + spot._id} className='mx-5'>¿Está libre?</label>
            <input disabled={!isBeingEdited} id={'availability' + spot._id} type="checkbox" checked={spot.available} onChange={handleAvailabilityChange} className='mx-2'/>
            <Button onClick={handleEdit}>{isBeingEdited ? 'Dejar de editar' : 'Editar'}</Button>
            {isBeingEdited && <Button onClick={handleSave}>Guardar</Button>}
            {isBeingEdited && <Button onClick={handleDelete}>Eliminar</Button>}
            {saveProgressMessage && <p className='my-5'>{saveProgressMessage}</p>}
            {deleteProgressMessage && <p className='my-5'>{deleteProgressMessage}</p>}
        </div>
    );
}
