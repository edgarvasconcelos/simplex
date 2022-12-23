import json    
import numpy as np

def myconverter(obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()


def dict_to_json(dict_object):
        jsonStr = json.dumps(dict_object, default=myconverter)
        return jsonStr