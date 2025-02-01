const {z}=require("zod")

const signupbody=z.object(
    {
    username:z.string().min(5,{message:"must have atleast 5 characters"}).max(100).email(),
    password:z.string().min(8,{message:"must have atleast 8 characters"}).max(15),
    firstname:z.string().min(3,{message:"must have atleast 3 characters"}).max(20),
    lastname:z.string().min(3,{message:"must have atleast 3 characters"}).max(20)
})
module.exports={
    signupbody
}