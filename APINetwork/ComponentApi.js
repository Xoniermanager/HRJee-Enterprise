import axiosDelete from './axiosDelete';
import axiosGePunchIn from './axiosGePunchIn';
import axiosGet from './axiosGet';
import AxiosPost from './axiosPost';
import axiosPost from './axiosPost';
import axiosPut from './axiosPut';


export const login = (url,data) => {
  let item = axiosPost(url,data);
  return item;
};
export const locationTracking = (url,data) => {
  let item = axiosPost(url,data);
  return item;
};
export const signUp = (url, data) => {
  let item = axiosPost(url, data);
  return item;
};
export const getProfile = (url,token) => {

  let item = axiosGet(url,token);
  return item;
};
export const getHoliday = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getLeaveType = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getAddress = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getNews = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getAnnouncement = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const updateProfile = (url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const updateAddress = (url,data,token) => {
  let item = axiosPut(url,data,token);
  return item;
};
export const LeaveApply = (url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const changePasswords = (url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const Dashboard=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const getDosageInstruction=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const getEmergencySupport=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const Reports=(url,data,token)=>{
  let item = axiosPost(url,data,token);
  return item;
}
export const AdminsterListing=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const getDiseaseDetails=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const patient = url => {
  let item = axiosGet(url);
  return item;
};
export const getDosageDetails =(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const AddListMedicine =(url,data,token,form) => {
  let item = axiosPost(url,data,token,form);
  return item;
};
export const Update_Password =(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const forget_password =(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const medicine_view =(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const AddMedication =(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const scheduleMedicine=(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const AddscheduleMedicine=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const getDashboard=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const upload_image=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const Report_Page=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const gethistory=(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getPatientDeatils=(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getMedicineList=(url,token) => {
  let item = axiosGet(url,token);
  return item;
}; 

export const AllPPEOtherStockDetails=(url,token) => {
  let item = axiosGet(url,token);
  return item;
}; 
export const getCheck=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const EditLog=(url,data,token,form) => {
  let item = axiosPut(url,data,token,form);
  return item;
};
export const DeleteAddminsterMedi=(url,data,token) => {
  let item = axiosDelete(url,data,token);
  return item;
};
export const EditPrn=(url,data,token,form) => {
  let item = axiosPut(url,data,token,form);
  return item;
};
export const setTokenDone=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const punchin=(url,data,token) => {
  let item = axiosGePunchIn(url,data,token);
  return item;
};
export const gettodayattendance=(url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getrecentattendence=(url,data,token) => {
  let item = axiosPost(url,data,token);
  return item;
};
export const logout = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const getResginList = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const ApplyResigns=(url,data,token)=>{
  let item=axiosPost(url,data,token);
  return item
}
export const WithdrawResigns=(url,data,token,form)=>{
  let item = axiosPut(url,data,token,form);
  return item
}
export const DetailsResign = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const menuaccess = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const DailyCheckAttendance = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const AssetsAPI = (url,token) => {
  let item = axiosGet(url,token);
  return item;
};
export const asignTask=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const UpdateStatusTask=(url,data,token,form)=>{
  let item = axiosPost(url,data,token,form);
  return item;
}
export const dispositionCode=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}

export const PRMCategory=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const AddPRM=(url,data,token,form)=>{
  let item = axiosPost(url,data,token,form);
  return item
}
export const detailsList=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const deletePRM=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const SalarySlip=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const AllPRMList=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const AttendanceRequest=(url,data,token,form)=>{
  let item = axiosPost(url,data,token,form);
  return item
}
export const faceuploadKyc=(url,data,token,form)=>{
  let item = axiosPost(url,data,token,form);
  return item
}
export const faceLogin=(url,data,token,form)=>{
  let item = axiosPost(url,data,token,form);
  return item
}
export const courseeList=(url,token)=>{
  let item = axiosGet(url,token);
  return item;
}
export const coourseDeatils=(url,token)=>{
  let item =axiosGet(url,token)
  return item;
}

