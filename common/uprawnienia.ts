const permition = {
  //read: 0,
  write: 1,
  //admin: 2,
  //next: 4
};  

class CheckPermition
{
    Read(user_permition: number)
    {
        return true;
    }
    Write(user_permition: number) : boolean
    {
        return (user_permition & permition.write) === permition.write;
    }
}