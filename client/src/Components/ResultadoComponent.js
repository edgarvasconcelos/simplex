
import * as React from 'react';


const ResultadoComponent = props => {
    return (

        <label className="text-gray">{" = "}<input className=" mt-2 bg-gray-100 appearance-none border-2 border-gray-200 rounded  py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-green-500" required type="number" name={props.chave} /></label>
    )
}

export default ResultadoComponent;