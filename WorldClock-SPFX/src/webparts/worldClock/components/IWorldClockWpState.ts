export interface IWorldClockWpState {
  userName: string; 
  error:any|undefined; 
  isLoading:boolean;
  currentPage:number;
  sharedIncreasedHours:any; 
  clocks?:any[]; 

  
}
export interface ILocation{ 
  Title?:string; 
  GMTValues?:number; 
  TimeZone:string; 
  Offset:string; 
  OfficeLink:string;
  sharedIncreasedHours:any;

}
export interface IWorldClockState{ 
  clocks?:any[];
}

