
export  function promiseReducer(state = {}, { type, name, status, payload, error }) {
    if (type === "PROMISE") {
        return {
            ...state,
            [name]: { status, payload, error },
        };
    }
    if(type === "DELETE_PROMISE"){
      return {
        ...state,
        [name] : { payload: []}
      }
    }
    return state;
  }

  export function jwtDecode(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {}
  }
  
  export const getGQL = url =>
    (query, variables = {}) =>
      fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.authToken ? { "Authorization": "Bearer " + localStorage.authToken } : {})
        },
        body: JSON.stringify({ query, variables })
      })
        .then(res => res.json())
        .then(data => {
          if (data.errors && !data.data) throw new Error(JSON.stringify(data.errors))
          return data.data[Object.keys(data.data)[0]]
        })
  
        export const backendURL = "http://player.node.ed.asmer.org.ua"
        export const gql = getGQL(backendURL + '/graphql')      
  

      

