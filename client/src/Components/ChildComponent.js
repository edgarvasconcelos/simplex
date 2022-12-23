
import * as React from 'react';

const ChildComponent = props => {

    return (

        <label className=" text-gray-500 font-bold md:text-center"><input className="  bg-gray-100 appearance-none border-2 border-gray-200 rounded  py-2 mt-3 px-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-green-500" name={props.chave} required />{" X"}<sub>{props.number}</sub></label>
    )

}

export default ChildComponent;