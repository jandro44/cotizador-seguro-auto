import { useState, createContext } from "react";
import { obtenerDiferenciaYear, calcularMarca, calcularPlan, formatearDinero } from "../helpers";

const CotizadorContext = createContext()

const CotizadorProvider = ({children}) => {

    // Se puede hacer con variables de state separadas para cada campo del formulario, pero en este caso se hara almacenando todo en un objeto
    const [datos, setDatos] = useState({
        marca: '',
        year: '',
        plan: ''
    });

    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(0);
    const [cargando, setCargando] = useState(false);

    const handleChangeDatos = e => {
        /* 
            Cuando se trabaja con un state de este tipo que tiene un objeto, 
            lo ideal es tomar una copia de lo que haya antes del objeto anterior y va a reescribir la propiedad con la seleccion o con lo que el usuario 
        */
        setDatos({
            ...datos, 
            [e.target.name] : e.target.value
        })
    }

    const cotizarSeguro = () => {
        // Una base 
        let resultado = 2000

        // Obtener diferencia de años
        const diferencia = obtenerDiferenciaYear(datos.year)
        

        // Hay que restar el 3% por cada año
        resultado -= ((diferencia * 3) * resultado) / 100

        // Europeo 30%
        // Americano 15%
        // Asiatico 5%
        resultado *= calcularMarca(datos.marca)

        // Basico 20%
        // Completo 50%
        resultado *= calcularPlan(datos.plan)

        // Opcion facil
        // resultado = resultado.toFixed(2)
        // Opcion formatear dinero
        resultado = formatearDinero(resultado)

        setCargando(true)

        setTimeout(() => {
            setResultado(resultado)
            setCargando(false)
        }, 1500);
    }

    return(
        <CotizadorContext.Provider
            value={{
                datos,
                handleChangeDatos,
                error,
                setError,
                cotizarSeguro,
                resultado,
                cargando
            }}
        >
            {children}
        </CotizadorContext.Provider>
    )
}

export {
    CotizadorProvider
}
export default CotizadorContext