import * as React from 'react';

import { escape } from '@microsoft/sp-lodash-subset';
import {IWorldClockWpState} from "./IWorldClockWpState";
import IEventData from "../../RxJsEventEmitter/IEventData"; 
import {RxJsEventEmitter} from '../../RxJsEventEmitter/RxJsEventEmitter';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { DisplayMode } from '@microsoft/sp-core-library';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder"; 
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebpartTitle";
import * as strings from "WorldClockSliderWebPartStrings"; 
import * as moment from "moment";
import {FocusZone,FocusZoneDirection,List,Spinner,css} from "office-ui-fabric-react"; 
import {Pagination} from "../../../shared/components/Pagination";
import { FilmstripLayout} from "../../../shared/components/filmstripLayout/index";
import { IReadonlyTheme  } from '@microsoft/sp-component-base';

import { IWorldClockProps } from './IWorldClockProps';


import { Clock } from './Clock';
const CacheKey: string = "DataReceiverWp"; 
const MaxMobileWidth : number = 480; 


export default class WorldClock extends React.Component<IWorldClockProps, IWorldClockWpState> {
  private readonly eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance(); 
  private receiveData(data: IEventData)
  { 
    debugger
    this.setState({ 
      clocks: data.sharedClocks
    });
  }

  public constructor(props:IWorldClockProps,state:IWorldClockWpState)
  { 
    super(props); 
    this.state= { 
      userName:"",
      isLoading:false, 
      error:undefined, 
      currentPage:1, 
      sharedIncreasedHours:0
    }
    this.eventEmitter.on("shareData",this.receiveData.bind(this)); 
  }

  private clocks = []; 
  private sharedIncreaseHours : any; 
  public componentDidMount():void 
  { 
    debugger;
    const dayTheme = "dayTheme"; 
    const eveningTheme = "eveningTheme"; 
    const nightTheme = "nightTheme";
    const WIDTH = 100; 
    const objHours = 0 ; 
    if(this.props.loadLocations() != null)
    { 
      this.props.loadLocations().then((options) => 
      { 

        let strCountries : any = ""; 
        let strLinks : any = ""; 
        let strGMTValue : any = ""; 
        let strTimeZone : any; 
        let strUTC : any = ""; 
        let lastTheme : any = ""; 
        let strOfficeLinksArr : any = []; 
        let strOfficeCountriesArr : any = []; 



        for(let i =0;i < options.length;i++)
        { 
          let objUTCOffSetVal; 
          objUTCOffSetVal = options[i].TimeZone; 
          let myDate: any = new Date(moment.tz(options[i].TimeZone).format('YYYY-MM-DDTHH:mm:ss')); 
          let TimeOfDay = moment(myDate).format("hh:,, A"); 
          let selectedTheme = null ; 
          var time = new Date(myDate).getHours(); 
          { 
            let timeOfDayMessage: string = ""; 
            if(time >= 8 && time < 17)
            { 
              timeOfDayMessage = "is having a great day Today."; 
              selectedTheme = dayTheme; 
            }
            else if(time >= 17 && time < 24)
            { 
              timeOfDayMessage = "is having a great evening right Now."; 
              selectedTheme = eveningTheme; 
            }
            else 
            { 
              timeOfDayMessage = "is all Good Night right now!";
              selectedTheme = eveningTheme;
            }
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 

            if(objUTCOffSetVal != strGMTValue && strGMTValue != '')
            { 
              this.clocks.push( 
                <span 
                className="Clock"
                > 
                <p > 
                  <Clock Country={strOfficeCountriesArr} HoursFormat={this.props.hoursFormat} Theme={lastTheme} officelink={strOfficeCountriesArr} minutesAdd={0} TimeZone={strTimeZone} /> 
                  </p>
                  </span>
              );
              strOfficeLinksArr = []; 
              strOfficeCountriesArr = []; 
              lastTheme = selectedTheme ; 
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
              lastTheme = selectedTheme; 
              strTimeZone = options[i].TimeZone; 
            }
          }
          if(i == (options.length -1))
          { 
            strGMTValue = options[i].TimeZone; 
            strTimeZone = options[i].TimeZone; 
            strOfficeLinksArr.push(options[i].OfficeLink); 
            this.clocks.push( 
              <span 
                 className="Clock"
                 > 
                 <p>
                   <Clock Country={strOfficeCountriesArr} HoursFormat={this.props.hoursFormat} Theme={selectedTheme} officelink={strOfficeLinksArr} minutesAdd={0} TimeZone={strTimeZone} /> 
                   </p> 
                   </span>
            );
          }
        }
        this.setState({sharedIncreasedHours:this.sharedIncreaseHours});

      
    }); 
    }
  }
  
  private _onChange = () : void => 
  { 

  }

  public componentDidUpdate(prevProps: IWorldClockProps,prevState: IWorldClockWpState) : void 
  { 

  }
  public render(): React.ReactElement<IWorldClockProps> {
    return (
      <div> 
        <div className="content">
          <div className='wmcSectionTitle'>{this.props.Heading}</div>
          <div className="wmcSectionSubTitle">{this.props.SubHeading}</div>
          {this._renderContent()}
          </div> 
        </div> 
     
    );
  }
  private _renderContent(): JSX.Element
  { 
    const isNarrow: boolean = this.props.clientWidth < MaxMobileWidth; 
    if(isNarrow)
    { 
      return this._renderNarrowList();  

    }
    else 
    { 
      return this._renderNormalList(); 
    }
  }
  private _renderNarrowList(): JSX.Element 
  { 
    let objHTML  :any; 
    if(this.props.ViewMoreTitle != null && this.props.ViewMoreTitle != '')
    { 
      objHTML = <div className="wmcNewsViewMoreLinkCont wmcLink"> 
      <a target="_break" href={this.props.ViewMoreURL}>{this.props.ViewMoreTitle}</a>
      </div>; 
    }
    else 
    { 
      objHTML = ""; 

    }
    if(this.state.clocks != null)
    { 
      this.clocks = this.state.clocks; 

    }
    return (<div> 
      <div> 
        <div role="application"> 
        <FilmstripLayout ariaLabel= {strings.FilmStripAriaLabel} clientWidth = {this.props.clientWidth} themeVariant={this.props.themeVariant}> 
        {this.clocks}
        </FilmstripLayout>
        </div>
        {objHTML}
        </div>
    </div>);
  }
  private _onPageUpdate = (pageNumber: number): void => {
      this.setState({ 
        currentPage: pageNumber
      })

  }
  private _renderNormalList(): JSX.Element 
  { 

    debugger;
    let objHTML: any; 
    if(this.props.ViewMoreTitle != null && this.props.ViewMoreTitle != '')
    { 
      objHTML = <div className="wmcNewsViewMoreLinkCont wmcLink"> 
      <a target="_blank" href={this.props.ViewMoreURL}>{this.props.ViewMoreTitle}</a>
      </div> 
    }
    else 
    { 
      objHTML = ""; 
    }
    if(this.state.clocks != null)
    { 
      this.clocks = this.state.clocks; 

    }
    return (<div> 
      <div> 
        <div role="application">
          <FilmstripLayout ariaLabel={strings.FilmStripAriaLabel}
          clientWidth={this.props.clientWidth}
          themeVariant={this.props.themeVariant}>
            {this.clocks}
            </FilmstripLayout> 
          </div> 
          {objHTML}
      </div>
      </div>
      )
  }
}
