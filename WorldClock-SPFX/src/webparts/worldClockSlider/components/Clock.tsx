import * as React from 'react'; 
import { escape } from '@microsoft/sp-lodash-subset'; 
import { IClockProps } from './IClockProps'; 
import * as moment from "moment-timezone"; 
import * as jstz from "jstz" ; 
import { ThemeSettingName } from '@uifabric/styling';

export interface IClockState 
{ 
    date: Date; 
    
}
export class Clock extends React.Component<IClockProps,IClockState> 
{ 
    private _timeID:number; 
    
    constructor(props: IClockProps)
    { 
        super(props); 
        this.state = 
        { 
            date: this.getDateTimeWithOffset()

        };
    }
    public componentDidMount():void 
    { 
        this._timeID = setInterval(() => this.tick(),1000);

    }
    public componentWillUnmount():void{ 
        clearInterval(this._timeID);
    }
    public render() : JSX.Element 
    { 
        const strAnchorTags : any [] = []; 
        const hoursDegrees: number = this.state.date.getHours() * 30 + this.state.date.getMinutes() /2; 
        const minutesDegrees : number = this.state.date.getMinutes() * 6 + this.state.date.getSeconds() /10; 
        const secondsDegrees : number = this.state.date.getSeconds() * 6; 
        
        const DisplayAnalogClock : boolean = true; 

        let styleDigitalCSS = ""; 
        let objTimeVal :  any; 
        if(this.props.Theme == "dayTheme")
        { 
            styleDigitalCSS = `digitalDayTheme`; 

        }
        if(this.props.Theme == "eveningTheme")
        { 
            styleDigitalCSS = `digitalEveningTheme`;
        }
        if(this.props.Theme == "nightTheme")
        { 
            styleDigitalCSS = `digitalNightTheme`;
        }
        const divStyleHours: any = { 
            transform: "rotateZ(" +  hoursDegrees + "deg)"
        };
        const divStyleMinutes: any = { 
            transform: "rotateZ(" +  minutesDegrees + "deg)"
        };
        const divStyleSeconds: any = { 
            transform: "rotateZ(" +  secondsDegrees + "deg)"
        };
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

        let officeLinks : any []; 
        let countries : any []; 
        if(this.props.Country.length > 1)
        { 
            officeLinks = this.props.officelink; 
            countries = this.props.Country; 
            const objOfficeData : any = []; 
            for(var i=0;i < officeLinks.length;i++)
            { 
                objOfficeData.push({OfficeLink:officeLinks[i],Country:countries[i]});

            }
            objOfficeData.sort((a,b) => (a.Country > b.Country) ? 1 : -1);
            for(var j=0;j<objOfficeData.length;j++)
            { 
                if(objOfficeData[j] != null)
                { 
                    let strHTML = <a className="AnchorTag" target="_blank" href={objOfficeData[j].OfficeLink}>
                         <p className="ClockTitle"> {objOfficeData[j].Country}</p>

                    </a> 
                    strAnchorTags.push(strHTML);

                }

            }
        }
        else 
        { 
            let strOfficeLink:any; 
            if(this.props.officelink.length == 0)
            { 
                strOfficeLink = "#";

            }
            else 
            { 
                strOfficeLink = this.props.officelink[0];
                
            }
            strAnchorTags.push(<a className="AnchorTag"  target="_blank"  href={strOfficeLink}> <p className="ClockTitle">
                {this.props.Country}</p></a>); 

                }

                if(this.state.date.getHours() == 0)
                { 
                    let strMinutes = ""; 
                    if(this.state.date.getMinutes() < 10)
                    { 
                        strMinutes = "0" + this.state.date.getMinutes().toString(); 

                    }
                    else 
                    { 
                        strMinutes = this.state.date.getMinutes().toString(); 

                    }
                    if(this.props.HoursFormat == true)
                    { 
                        objTimeVal = <a className="AnchorTag" target="_blank"><div className={styleDigitalCSS}> 
                        {<div className="clockDate">{escape(this.state.date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:this.props.HoursFormat
                    
                    }))}</div>}
                    {<div className="DayDate"> {days[this.state.date.getDay()]+ ", " + this.state.date.getDate()}
                    {months[this.state.date.getMonth()]}</div>}{strAnchorTags}</div></a>;
                    
                         
                    }
                    else 
                    { 
                        objTimeVal  = <a className="AnchorTag" target="_blank"> 

                        <div className={styleDigitalCSS}>{<div className="clockDate">{"0" + this.state.date.getHours().toString() + ":" + strMinutes}</div>}{<div className="DayDate">{days[this.state.date.getDay()] + "," + this.state.date.getDate()}{months[this.state.date.getMonth()]}</div>}{strAnchorTags}</div> </a>
                    }
                }
                else 
                { 
                    objTimeVal = <a className="AnchorTag" target="_blank"> <div className={styleDigitalCSS}> 
                    {<div className="clockDate">{escape(this.state.date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:this.props.HoursFormat}))}</div>}
                    {<div className="DayDate">{days[this.state.date.getDay()] + "," + this.state.date.getDate()}{months[this.state.date.getMonth()]}</div> }{strAnchorTags}</div></a>;

                }

                return     ( 
                    <div> 
                        {
                        (objTimeVal)
    }
                        </div>
                );
    }
    private tick():void
    { 
        this.setState({

            date:this.getDateTimeWithOffset()
        }); 
    }
    private getDateTimeWithOffset(): Date{ 
        const now: Date = new Date(); 
        const withoutDSTDate: Date = new Date(now.getFullYear(),0,1);
        const withDSTDate: Date = new Date(now.getFullYear(),6,1);
        const isDST: boolean = now.getTimezoneOffset() < Math.max(withoutDSTDate.getTimezoneOffset(),withDSTDate.getTimezoneOffset());
        const utcNow: Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const getDateTimeWithOffset: Date = new Date(moment.tz(this.props.TimeZone).format('YYYY-MM-DDTHH:mm:ss'));
        const dateTimeWithOffsetVal:Date = new Date(getDateTimeWithOffset.getTime() + (this.props.minutesAdd * 60000));
        return(dateTimeWithOffsetVal);
    }
}