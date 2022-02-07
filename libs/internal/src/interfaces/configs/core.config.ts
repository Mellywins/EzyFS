export interface CoreConfig{
    app:{
        port:number
    }
    database:{
        postgres:{
            uri:string,
            name:string,
            options:string
        }
    }
    redis:{
        host:string,
        port:number,
        password:string
    }
}