const checkLog = (id: number) => {
  return true;
};

function Log(id: number, message: any, ...optionalParams: any) {
  var date = new Date();
  checkLog(id) &&
    console.log(
      date.toISOString().replace("T", " ").replace("Z", "") + " ",
      message,
      optionalParams
    );
}

export { Log };
