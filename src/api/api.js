import axios from 'axios';
import  qs  from 'qs';


/**
 * 调用服务地址
 * @type {string}
 */
let url, Upurl, ImgUrl,reporturl;
// if(process.env.NODE_ENV==='production'){
//   // 有些浏览器(主要是IE)没有这个属性，所以我们需要手工构建它……
//   if (!window.location.origin) {
//     window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
//   }
  url='/api'; //开发环境下的配置
  Upurl='/api';
  reporturl='http://localhost:8080/';
  ImgUrl='http://localhost:8080/';//上传图片的访问地址
// }

export {
  url, Upurl, ImgUrl,reporturl
}

//add by ggh 
export  const  METHODS= {
  GET: "get",
  POST: "post",
  PUT: "put",
  POST_JSON:"post_json"
}

//add by ggh
export  const  http_Req =  (method,action,params)=> {
  return new Promise((resolve, reject) => {
    try {

      //定义请求参数配置
      let config = {
        url: action,
        baseURL: url,
        // 请求方法同上
        method: method.replace('_json', ''),
        transformRequest: [function (data) {
          // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
          switch (method) {
            case METHODS.GET:
            case METHODS.POST:
            case METHODS.PUT:
              return qs.stringify(data);
              break;
            case  METHODS.POST_JSON:
              return JSON.stringify(data);
              break;
          }
        }],

        transformResponse: [function (data) {
          // 这里提前处理返回的数据
          return data;
        }],
        // 请求头信息
        headers: {
          'Content-Type': method === METHODS.POST_JSON ? 'application/json' : 'application/x-www-form-urlencoded',
          'x-auth-token': store.getters.token,
        },
        //设置超时时间
        timeout: 60000,
        //返回数据类型
        responseType: 'json', // default
        // changeOrigin:true,
        withCredentials:true,
      }
      //设置请求数据
      switch (method) {
        case METHODS.GET:
        case METHODS.PUT:
          config.params = params;
          break;
        case METHODS.POST:
        case  METHODS.POST_JSON:
          config.data = params;
          break;
      }

      let reqObj = {
        reqStatus: false, // 成功失败标示  Success 成功  fail 失败
        Data: {status: "FAIL", errorMsg: "请求失败！", result: {}} // 返回参数
      };
      axios(config).then(function (response) {
        //请求成功
        reqObj.Data = response.data;
        reqObj.reqStatus = response.status === 200 && reqObj.Data.status === "SUCCESS";
        reqObj.Data.constructor === String && (reqObj.Data = JSON.parse(reqObj.Data))
        setTimeout(() => {
          resolve({reqStatus: reqObj.reqStatus, record: reqObj.Data.result, errMsg: reqObj.Data.errorMsg});

        }, 100)
      }).catch(function (response) {
        setTimeout(() => {
          reject(new Error(response instanceof Error ? response.message : "请求失败"))
        }, 100);
      })

    } catch (e) {
      setTimeout(() => {
        reject(e);
      }, 100);
    }

  })
}




/**
 * 发送一个`普通Key-value形式的 POST`请求
 * @method http_post
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const http_post= (action,params,callback) => {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  let token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    // 请求方法同上
    method: 'post', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      // console.log(qs.stringify(data))
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],

    // 请求头信息
  headers: {
    'x-auth-token': token
  },

    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
    // changeOrigin:true,
  }

  axios.post(url+action, params ,config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if(response.status===200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if(response instanceof  Error){
      resultObj.Data=response.message;
    } else {
      resultObj.Data = response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}



/**
 * 发送一个`普通Key-value形式的 POST`请求  add by ggh 2018-04-02  供应商注册时用到
 * @method http_post
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const http_post_NoLanding= (action,params,callback) => {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  let token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    // 请求方法同上
    method: 'post', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      // console.log(qs.stringify(data))
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],

    // 请求头信息
    headers: {
      'x-auth-token': token
    },

    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
    // changeOrigin:true,
  }
  axios.post(Upurl+action, params ,config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if(response.status===200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if(response instanceof  Error){
      resultObj.Data=response.message;
    } else {
      resultObj.Data =response ? response : {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}


/**
 * 发送一个`Json数据格式的 POST`请求
 * @method http_post
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const httpJsonPost= (action,params,callback) => {
  // axios.defaults.headers.post['Content-Type'] = 'application/json';
  let token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL", errorMsg: "请求失败！", result: {}} // 返回参数
  }
  let config = {
    url:action,
    baseURL:url,
    // 请求方法同上
    method: 'post', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      //console.log(JSON.stringify(data))
      return JSON.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    data:params,
    // 请求头信息
    headers: {
      'Content-Type':'application/json',
      'x-auth-token': token
    },
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
    // changeOrigin:true,
  }
  axios(config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if(response.status===200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if(response instanceof  Error){
      resultObj.Data=response.message;
    } else {
      resultObj.Data = response ? response : {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}


/**
 * 发送一个免登陆的` `Json数据格式的 POST`请求  add by ggh 注册时用到
 * @method http_post
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const httpJsonPost_NoLanding= (action,params,callback) => {
  // axios.defaults.headers.post['Content-Type'] = 'application/json';
  let token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL", errorMsg: "请求失败！", result: {}} // 返回参数
  }
  let config = {
    url:action,
    baseURL:Upurl,
    // 请求方法同上
    method: 'post', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      //console.log(JSON.stringify(data))
      return JSON.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    data:params,
    // 请求头信息
    headers: {
      'Content-Type':'application/json',
      'x-auth-token': token
    },
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
    // changeOrigin:true,
  }
  axios(config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if(response.status===200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if(response instanceof  Error){
      resultObj.Data=response.message;
    } else {
      resultObj.Data = response ? response: {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}


/**
 * 发送一个`GET`请求
 * @method http_get
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const http_get= (action,params,callback) => {
  const token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    url:action,
    baseURL:url,
    // 请求方法同上
    method: 'get', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    // 请求头信息
    headers: {
      'x-auth-token': token
    },
    params:params,
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
  }

  axios(config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if (response.status === 200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    } else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if (response instanceof Error) {
      // console.log('Error ', response.name+' and '+response.message);
      resultObj.Data = response.message;
    } else {
      resultObj.Data = response ? response: {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}



/**
 * 发送一个免登陆的`GET`请求 add by ggh 注册时用到
 * @method http_get
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */
export const http_get_NoLanding= (action,params,callback) => {
  const token = sessionStorage.getItem('token') || '';
  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    url:action,
    baseURL:Upurl,
    // 请求方法同上
    method: 'get', // default
    transformRequest: [function (data) {
      /**
       * 这里可以在发送请求之前对请求数据做处理，
       * 比如form-data格式化等，
       * 这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
       * **/
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    // 请求头信息
    headers: {
      'x-auth-token': token
    },
    params:params,
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
  }
  axios(config).then(function (response) {
   //console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if (response.status === 200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    } else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if (response instanceof Error) {
      // console.log('Error ', response.name+' and '+response.message);
      resultObj.Data = response.message;
    } else {
      resultObj.Data = response ? response : {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}




/**
 * 发送一个`put`请求
 * @method http_put
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */

export const http_put= (action,params,callback) => {
  const token = sessionStorage.getItem('token') || '';

  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    url:action,
    baseURL:url,
    // 请求方法同上
    method: 'put', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    // 请求头信息
    headers: {
      'x-auth-token': token
    },
    params:params,
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
  }
  axios(config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if (response.status === 200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    } else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if (response instanceof Error) {
      // console.log('Error ', response.name+' and '+response.message);
      resultObj.Data = response.message;
    } else {
      resultObj.Data = response ? response : {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}

/**
 * 发送一个`delete`请求
 * @method http_delete
 * @param action 请求方法
 * @param params 参数
 * @param callback 回调函数
 * @returns {返回值类型} 返回值说明
 * @version v-0.0.0.001
 * @author szj
 */

export const http_delete= (action,params,callback) => {
  const token = sessionStorage.getItem('token') || '';

  let resultObj = {
    Result: false, // 成功失败标示  Success 成功  fail 失败
    Data: {status: "FAIL",errorMsg:"请求失败！", result: {}} // 返回参数
  };
  let config = {
    url:action,
    baseURL:url,
    // 请求方法同上
    method: 'delete', // default
    transformRequest: [function (data) {
      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
      return qs.stringify(data);
    }],

    transformResponse: [function (data) {
      // 这里提前处理返回的数据
      return data;
    }],
    // 请求头信息
    headers: {
      'x-auth-token': token
    },
    params:params,
    //设置超时时间
    timeout: 60000,
    //返回数据类型
    responseType: 'json', // default
  }
  axios(config).then(function (response) {
    // console.log("成功")
    // console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    if (response.status === 200) {
      resultObj.Result = true;
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    } else {
      response.data.constructor === String && (resultObj.Data = JSON.parse(response.data),!0) || (resultObj.Data = response.data)
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  }).catch(function (response) {
    if (response instanceof Error) {
      // console.log('Error ', response.name+' and '+response.message);
      resultObj.Data = response.message;
    } else {
      resultObj.Data = response ? response : {};// response ? response.data : {};
      resultObj.Data.errorMsg = "网络或服务器错误请求失败！";
    }
    setTimeout(()=> {
      let {Result: reqStatus, Data: {status}, Data: {result: record}, Data: {errorMsg: errMsg}} = resultObj;
      callback(reqStatus, status, record,errMsg);
    },100)
  });
}


export function requestData(url, data = {}, method = 'post', dispatch) {
  const defer = new Promise((resolve, reject) => {
    let token = sessionStorage.getItem('token') || '1103a920-0270-4ed5-9443-54e4943228cf'
    if (!token) {
      message.error('token不存在')
      return
    }
    data = method === 'get' ? {params: data} : data
    const instance = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        'x-auth-token': token
      },
      validateStatus: status => status >= 200 && status < 300
    })
    dispatch && dispatch(toggleLoading(true))
    instance[method](requestKey[url], data)
      .then(response => response.data)
      .then(response => {
        dispatch && dispatch(toggleLoading(false))
        if (response.code === 0) {
          resolve(response)
        } else {
          message.error(response.msg)
          reject(response)
        }
      })
      .catch(error => {
        dispatch && dispatch(toggleLoading(false))
        if (error.message && error.message.indexOf('timeout') > -1) {
          message.error('网络请求超时')
        } else {
          message.error('网络响应错误')
        }
      })
  })
  return defer
}

/**
 * response拦截器
 */
axios.interceptors.response.use(
  response => {
    if(response){
      if(response.data.status!="SUCCESS" && response.data.errorCode==="S2002"){
         location.href="/";
       // console.log(response.data.errorCode);
      }
      return response;
    }

  },
  error => {
    if (error.response) {
      // switch (error.response.status) {
      //   case 401:
      //     store.commit(types.LOGOUT);
      //     router.replace({
      //       path: 'login',
      //       query: {redirect: router.currentRoute.fullPath}
      //     })
      // }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
