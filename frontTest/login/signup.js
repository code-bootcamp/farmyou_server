// 휴대폰 인증 토큰 전송하기
const getValidationNumber = async () => {
  const aaa = document.getElementById("PhoneNumber01").value;
  const bbb = document.getElementById("PhoneNumber02").value;
  const ccc = document.getElementById("PhoneNumber03").value;
  const myphone = aaa + bbb + ccc;
  console.log(myphone);
  axios
    .post("http://localhost:3000/tokens/phone", {
      aaa: myphone,
    })
    .then((res) => {
      console.log(res);
    });

  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
};

const submitSignup = async () => {
  const userName = document.getElementById("SignupName").value;
  const userPersonal = document.getElementById("SignupPersonal").value;
  const userPrefer = document.getElementById("SignupPrefer").value;
  const userEmail = document.getElementById("SignupEmail").value;
  const userPwd = document.getElementById("SignupPwd").value;
  
  axios.post("http://localhost:3000/users", {
    myuser: {
      name: userName,
      presonal: userPersonal,
      prefer: userPrefer,
      email: userEmail,
      pwd: userPwd
    },
  });

  axios
    .post("http://localhost:3000/users", {
      myuser: myphone,
    })
    .then((res) => {
      console.log(res);
    });

  console.log("회원 가입 이메일 전송");
};