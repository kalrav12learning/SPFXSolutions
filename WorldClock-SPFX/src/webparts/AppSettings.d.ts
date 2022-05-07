declare interface IAppSettings
{ 
    SiteName:string; 
    AssetURL:string; 
}

declare module 'AppSettings'
{ 
    const appSettings : IAppSettings ; 
    export = appSettings ; 
}