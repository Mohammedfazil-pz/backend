const pg=require("pg")

const DB=new pg.Pool({
    host:"localhost",
    database:"taskDB",
    password:"fazil",
    user:"postgres"
})

const onConnection=async()=>{
    try {
        await DB.query("SELECT NOW()")
        console.log("DB CONNECTED")
    } catch (error) {
        console.log('DB CONNECTION ERROR',error)
    }
}

onConnection()

module.exports=DB