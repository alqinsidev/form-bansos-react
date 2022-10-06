import { FormPayload } from "../../redux/slice/formSlice";

export interface ResponseResult {
    success: boolean
    message: string
  }
const FormService = {
    postData: async (data: FormPayload) => {
        return new Promise<ResponseResult>( (resolve, reject) => setTimeout(()=> {
            const result = Math.random() > 0.4 ? true : false
            console.log(data);
            if(result){
                resolve({success:true,message:"Form pengajuan berhasil di submit"})
            } else {
                reject({success:false,message:"Server sedang sibuk, cobalah beberapa saat lagi"})
            }
        } ,1500))
    }
}

export default FormService