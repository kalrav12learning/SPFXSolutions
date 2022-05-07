
import * as appSettings from 'AppSettings'; 
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader'; 
import {SPHttpClient,SPHttpClientResponse} from '@microsoft/sp-http'


import * as strings from 'WorldClockSliderWebPartStrings';
import WorldClockSlider from './components/WorldClockSlider';
import { Web } from 'sp-pnp-js/lib/sharepoint/webs';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { IWorldClockSliderProps,ILocation} from './components/IWorldClockSliderProps';
import { IPropertyPaneDropdownOption,
         PropertyPaneDropdown,
        PropertyPaneToggle, 
        PropertyPaneLabel,
        PropertyPaneCheckbox

} from "@microsoft/sp-property-pane"; 
import 
{ 
  PropertyFieldListPicker, 
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker"; 
import {CalloutTriggers} from "@pnp/spfx-property-controls/lib/PropertyFieldHeader"; 
import { PropertyFieldNumber} from "@pnp/spfx-property-controls/lib/PropertyFieldNumber"; 
import {PropertyFieldSliderWithCallout} from "@pnp/spfx-property-controls/lib/PropertyFieldSliderWithCallout"; 
import {PropertyFieldTextWithCallout} from "@pnp/spfx-property-controls/lib/PropertyFieldTextWithCallout"; 
import {PropertyFieldToggleWithCallout} from "@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout"; 
import { sp  } from "@pnp/sp/presets/all"; 
import {ThemeProvider,ThemeChangedEventArgs,IReadonlyTheme,ISemanticColors} from '@microsoft/sp-component-base'; 

export interface IWorldClockSliderWebPartProps {
  Heading:string;
  SubHeading:string; 
  ViewMoreTitle:string; 
  ViewMoreURL:string; 
  selectedList:string; 
  HoursFormat:boolean; 
  description: string;
}

export default class WorldClockSliderWebPart extends BaseClientSideWebPart<IWorldClockSliderWebPartProps> {
  private _providerList: any[]; 
  private _themeProvider: ThemeProvider; 
  private _themeVariant: IReadonlyTheme | undefined; 

  protected async onInit(): Promise<void> 
  { 
    debugger;
    const head: any = document.getElementsByTagName("head")[0] || document.documentElement; 
    let versionUpdate; 

    if(head.lastElementChild.href != null)
    { 
      if(head.lastElementChild.href.indexOf("WMCentralStyle.css") == -1)
      { 
        versionUpdate = (new Date()).getTime();
        await this.context.httpClient.get(appSettings.AssetURL + "/WMCentralStyle.css?v=" + versionUpdate,SPHttpClient.configurations.v1);
        SPComponentLoader.loadCss( appSettings.AssetURL + "/WMCentralStyle.css?v="+ versionUpdate);
     
        SPComponentLoader.loadCss( appSettings.AssetURL + "/slick.min.css?v="+ versionUpdate);
     SPComponentLoader.loadCss(appSettings.AssetURL +  "/slick-theme.min.css?v="+ versionUpdate);
      }
      

    }
    else 
    { 
      versionUpdate = (new Date()).getTime();
      await this.context.httpClient.get(appSettings.AssetURL + "/WMCentralStyle.css?v=" + versionUpdate,SPHttpClient.configurations.v1);
      SPComponentLoader.loadCss( appSettings.AssetURL + "/WMCentralStyle.css?v="+ versionUpdate);
   
      SPComponentLoader.loadCss( appSettings.AssetURL + "/slick.min.css?v="+ versionUpdate);
   SPComponentLoader.loadCss(appSettings.AssetURL +  "/slick-theme.min.css?v="+ versionUpdate);
    
    }
      super.onInit().then((_) => 
      { 
        sp.setup({ 
            spfxContext:this.context, 
            defaultCachingStore:"local", 
            defaultCachingTimeoutSeconds:10, 
            globalCacheDisable:true,

        } 
          
        );
      }); 
      return new Promise<void>((resolve,_reject) => { 
        this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey); 
        this._themeVariant = this._themeProvider.tryGetTheme(); 
        this._themeProvider.themeChangedEvent.add(this,this._handleThemeChangedEvent); 
        resolve(undefined); 



      }
      
      );
    
  }
  private _onChnage = (ev: any): void => 
  { 

  }
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void
{ 
  this._themeVariant = args.theme; 
  this.render(); 

}
  public render(): void {
    let bool24HoursFormat:boolean = false; 
    const { clientWidth } = this.domElement; 
    let objLocations : any; 
    objLocations = this._getLocationsNew.bind(this); 
    if(this.properties.HoursFormat == true) 
    { 
      bool24HoursFormat = false; 
    }
    else 
    { 
      bool24HoursFormat = true; 
    }
    const element: React.ReactElement<IWorldClockSliderProps> = React.createElement(
      WorldClockSlider,
      {
        ViewMoreTitle:this.properties.ViewMoreTitle, 
        ViewMoreURL:this.properties.ViewMoreURL,
        context:this.context, 
        hoursFormat:bool24HoursFormat, 
        Heading:this.properties.Heading, 
        SubHeading:this.properties.SubHeading, 
        loadLocations:this._getLocationsNew.bind(this),
        themeVariant:this._themeVariant, 
        clientWidth:clientWidth
      }
    );

    ReactDom.render(element, this.domElement);
  }
  private _isConfigured():boolean{ 
    return null; 

  }
  protected texboxValidationMethod(value:string):string{ 
    if(value == '')
    { 
      return "Please enter a value"
    }
  }
  private _getLocationsNew():Promise<ILocation[]> 
  { 
    debugger;
    let filter: string = ""; 

    filter = "IsActive eq 1"; 
    let objList : any; 
    
    let siteCollectionUrl = this.context.pageContext.site.absoluteUrl.replace(this.context.pageContext.site.serverRelativeUrl,"") + "/sites/" +  appSettings.SiteName;
    let web; 
    objList = this.properties.selectedList; 
    web = new Web(siteCollectionUrl); 
    return web.lists
    .getById(objList)
    .items.filter(filter)
    .select("Title","ListOrder","TimeZone","OfficeLink") 
    .orderBy("ListOrder")
    .get()
    .then((Locations) => 
    { 
      debugger
      return Locations; 
    })
    .catch((error) => { 
console.log("Error Loading All Lists"); 
console.log(error ); 
return []; 


    }
    
    );
  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const { 
      selectedList
    } = this.properties; 

    return {
      pages: [
        {
         displayGroupsAsAccordion:true,
          groups: [
            {
              groupName:"Source", 
              groupFields: [
                     PropertyFieldListPicker("selectedList",
                     {
                       label:"Select a list", 
                       selectedList:selectedList, 
                       includeHidden:false, 
                       orderBy:PropertyFieldListPickerOrderBy.Title, 
                       disabled:false, 
                       webAbsoluteUrl:this.context.pageContext.web.absoluteUrl, 
                       onPropertyChange:this.onPropertyPaneFieldChanged.bind(this), 
                       properties:this.properties, 
                       context:this.context, 
                       onGetErrorMessage:null, 
                       deferredValidationTime:0, 
                       key:"listPickerFieldId",
                     }
                     ), 
                     PropertyPaneToggle("HoursFormat", 
                     { 
                       label:"24 Hours Format", 
                       checked:this.properties.HoursFormat , 
                       key:"HoursFormat",
                     }
                     ), 
                     PropertyPaneTextField('ViewMoreTitle', 
                     { 
                       label:"ViewMoreTitle", 
                       multiline:false, 
                       resizable:false, 
                     }
                     ), 
                     PropertyPaneTextField('ViewMoreURL',
                     { 
                       label:"ViewMoreURL", 
                       multiline:false, 
                       resizable:false, 
                     }
                     )


              ]
            
            }
          ]
        }
      ]
    };
  }
}
