import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { IWebPartContext } from "@microsoft/sp-webpart-base";


export interface IWorldClockProps {
  context:IWebPartContext;
  ViewMoreTitle:string; 
  ViewMoreURL:string;
  loadLocations:() => Promise<ILocation[]> ; 
  Heading:string; 
  SubHeading:string;
  hoursFormat:boolean; 
  themeVariant:IReadonlyTheme; 
  clientWidth:number; 
  description: string;
}

export interface ILocation 
{ 
  Title?:string; 
  GMTValues?:number; 
  TimeZone:string; 
  OfficeLink:string; 
  Offset:string; 

}
export interface IWorldClockWpState
{ 
  clocks?:any[];
}
