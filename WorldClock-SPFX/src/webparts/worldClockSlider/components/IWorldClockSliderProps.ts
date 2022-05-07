import { DisplayMode } from "@microsoft/sp-core-library";
import { IWebPartContext } from "@microsoft/sp-webpart-base"; 
import { IReadonlyTheme } from "@microsoft/sp-component-base";
export interface IWorldClockSliderProps {
  context: IWebPartContext; 
  ViewMoreTitle:string; 
  ViewMoreURL:string; 
  loadLocations: () => Promise<ILocation[]> 
  themeVariant: IReadonlyTheme; 
  clientWidth:number;
  Heading:string; 
  SubHeading:string; 
  hoursFormat:boolean; 

 
}
export interface ILocation 
{ 
  Title?:string; 
  GMTValues?: number; 
  Offset:string; 
  TimeZone:string; 
  OfficeLink:string; 

}
export interface IWorldClockSliderState{ 
  clocks?:any[]; 
  
}