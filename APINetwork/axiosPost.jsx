import axios from "axios";
const axiosPost=async(url,data,token,form)=>{
 
    var config = {
        method: 'post',
        url: url,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          // 'Content-Type':form==1? 'multipart/form-data':'application/json', 
          //    'Accept': 'application/json',
        },
        data
      };
      console.log("restoken........", config?.data)
     
   const response=await axios(config)
    .then(function (response) {
     
      return(response)
    })
    .catch(function (error) {
      // alert(error?.response?.data?.message, "233");
      return (error)
    });


return response;
    
}

export default axiosPost;
