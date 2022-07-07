import React from 'react';

import { TouchableOpacity, Image} from 'react-native';

const UCheckbox = ({style, value, onChange}) => {
    // handles the change on actual element 
    const handleChange =({target})=>{    
      if(typeof onChange === 'function'){
         // call the callback passing in whatever parameters you decide
         // in this simple case just sending numeric value
         onChange(!value)
      }    
    }

    let img = (value === true) ? require('../assets/checkbox_1.png') : require('../assets/checkbox_0.png');

    return (
        <TouchableOpacity onPress={handleChange} style={style}>
            <Image source={img} style={style} resizeMode="stretch" />
        </TouchableOpacity>
    );
};

export default UCheckbox;
