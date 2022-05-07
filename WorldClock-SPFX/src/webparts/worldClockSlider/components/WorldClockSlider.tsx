import * as React from 'react';


import styles from './WorldClockSlider.module.scss';
import { IWorldClockSliderProps } from './IWorldClockSliderProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from "moment"; 
import InputRange from "react-input-range"; 
import { IWorldClockSliderState } from './IWorldClockSliderState';
import IEventData from "../../RxJsEventEmitter/IEventData"; 
import {RxJsEventEmitter} from "../../RxJsEventEmitter/RxJsEventEmitter"; 
import { Clock } from "./Clock";
import { ClearCacheProvider,useClearCacheCtx} from "react-clear-cache"; 
import "react-input-range/lib/css/index.css"; 
import { Slider } from "office-ui-fabric-react/lib/Slider"; 
import { 
  IStackTokens, 
  Stack, 
  IStackStyles
} from "office-ui-fabric-react/lib/Stack";
const stackStyles:Partial<IStackStyles> = {root: {maxWidth:300}} ;
const stackTokens:IStackTokens = {childrenGap:20}; 
const sliderAriaValueText = (value:number) => `${value} percent`; 
const slidervalueFormat = (value:number) => `${value}%`; 


export default class WorldClockSlider extends React.Component<IWorldClockSliderProps, IWorldClockSliderState> {

  private readonly eventEmitter:RxJsEventEmitter = RxJsEventEmitter.getInstance();
  private DisplayAnalog: any; 
  private DisplaySeconds: any; 
  private clocks:any = []; 
  public constructor ( 
    props:IWorldClockSliderProps, 
    state:IWorldClockSliderState
  )
  { 
    super(props); 
    this.state = 
  { 
    userName:"", 
    isLoading:false, 
    error:undefined,
    currentPage:1, 
    value:24, 
    DisplayAnalog:false, 
    DisplaySeconds:false 
  };
  }
  public render(): React.ReactElement<IWorldClockSliderProps> {
    debugger;
    let mediaMatchIpad = window.matchMedia("(max-width:750px)"); 
    let width: any; 
    if(!mediaMatchIpad.matches)
    { 
      width = 
      { 
        width:"600px", 
        margin:"0 auto"
      };

    }else 
    { 
      width = 
      { 
        display:"none"
      };
    }
    const { value } = this.state.value; 

    return (
      <div style={width}> 
      <Slider
        label=""
        min={0}
        max={24}
        step={0.5}
        defaultValue={0}
        showValue={true}
        onChange={e => { 
          this.setSliderValue(e); 
        }}
        className={"sliderWidth"}
      /> 
      <span className="marginLeft15">Hours</span> 
      <div className="wmcNewsViewMoreLinkCont wmcLink">
        <a target="_blank" href={this.props.ViewMoreURL}> 
        {this.props.ViewMoreTitle}
        </a> 
        </div> 
       </div> 
  
    );
  }
  private _onChange = (ev:any): void => {}; 
  private async setSliderValue(value: number) : Promise<void> 
  { 
    let strCountries: any = ""; 
    let strLinks: any=""; 
    let strGMTValue: any = ""; 
    let strUTC: any= ""; 
    this.clocks = []; 
    if(this.props.loadLocations() != null)
    { 
      const dayTheme = "dayTheme"; 
      const eveningTheme = "eveningTheme"; 
      const nightTheme  = "nightTheme"; 
      let lastTheme: any = ""; 
      let strTimeZone: any; 
      await this.props.loadLocations().then(options => 
        { 
            this.clocks = []; 
            const months= [ 
                "Jan", 
                "Feb", 
                "Mar", 
                "Apr", 
                "May", 
                "Jun", 
                "Jul", 
                "Aug", 
                "Sep", 
                "Oct", 
                "Nov", 
                "Dec"

            ];

            let strOfficeLinksArr: any = [] ; 
            let strOfficeCountriesArr: any = []; 
            for(let i=0;i < options.length;i++)
            { 
              let objUTCOffSetNewVal; 
              let objOFfset; 
              let objUTCOffSetVal; 

              objUTCOffSetVal = options[i].TimeZone; 
              let objMinutes: any = Number(value) * 60; 
              const myDatValue: Date = new Date(moment.tz(options[i].TimeZone).format("YYYY-MM-DDTHH:mm:ss") ); 
              const myDate: any = new Date(myDatValue.getTime() + objMinutes * 6000); 
              let TimeofDay = moment(myDate).format('hh:mm A');
              let selectedTheme = null; 
              var time = new Date(myDate).getHours(); 
              { 
                let timeOfDayMessage: string = ""; 
                if(time >= 8 && time < 17)
                { 
                  timeOfDayMessage = "is having a great day Today."; 
                  selectedTheme = dayTheme; 

                }
                else if ( time >= 17 && time < 24)
                { 
                  timeOfDayMessage = "is having a great evening right Now."
                  selectedTheme = eveningTheme; 

                }
                else 
                { 
                  timeOfDayMessage = "is all Good Night right now!"; 
                  selectedTheme = eveningTheme; 

                }
                if(objUTCOffSetVal != strGMTValue && strGMTValue != "")
                { 
                  this.clocks.push(
<span className="Clock"> 
<p>
  <Clock 
    Country={strOfficeCountriesArr}
    Theme={lastTheme}
    HoursFormat={this.props.hoursFormat}
    officelink = {strOfficeLinksArr}
    minutesAdd={objMinutes}
    TimeZone={strTimeZone}
    /> 
  </p> 
</span>

                  );
                  strOfficeLinksArr = []; 
                  strOfficeCountriesArr  = []; 
                  lastTheme  = selectedTheme; 
                  strGMTValue = options[i].TimeZone; 
                  strTimeZone = options[i].TimeZone; 
                  strOfficeCountriesArr.push(options[i].Title); 
                  strOfficeLinksArr.push(options[i].OfficeLink); 
                }
                else 
                { 
                  strOfficeLinksArr.push(options[i].OfficeLink);
                  strOfficeCountriesArr.push(options[i].Title);
                  strGMTValue = options[i].TimeZone;
                  lastTheme  = selectedTheme;
                  strTimeZone = options[i].TimeZone;
                }
              }
              if(i == options.length - 1)
              { 
                strGMTValue = options[i].TimeZone; 
                strTimeZone = options[i].TimeZone; 
                strOfficeLinksArr.push(options[i].OfficeLink);
                this.clocks.push(
                   <span className="Clock"> 
                   <p>
                     <Clock 
                      Country={strOfficeCountriesArr}
                      Theme={selectedTheme}
                      HoursFormat={this.props.hoursFormat}
                      officelink={strOfficeLinksArr}
                      minutesAdd={objMinutes}
                      TimeZone={strTimeZone} /> 

                     </p> 
                   </span>
                    
                   


                )
              }
            }

        }
        
        )
    }
    this.setState({ 
      clocks:this.clocks
    });
    this.sendData(this.clocks);
  }
  private sendData(clocks:any): void 
  { 
    var eventBody = { 
      sharedClocks : clocks 
    } as IEventData; 
    this.eventEmitter.emit("shareData", eventBody);
    
  }
}
