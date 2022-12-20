import * as React from 'react';



const CondicaoComponent = props => {

    return (
        <select className="form-select appearance-none
        px-3
        py-1.5
        ml-2
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" name={props.chave}>
          <option value="-1">{'<='}</option>
          <option value="0">{'>='}</option>
          <option value="1"> = </option>
        </select>
    )
}

export default CondicaoComponent;