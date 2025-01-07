import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration,PropertyPaneTextField} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ProjectTimeSheetWebPartStrings';
import ProjectTimeSheet from './components/ProjectTimeSheet';
import { IProjectTimeSheetProps } from './components/IProjectTimeSheetProps';

export interface IProjectTimeSheetWebPartProps {
  description: string;
  absoluteURL: any;
  spHttpClient: any;
  context:any;
  title:any;
  Attachment:any;
}

export default class ProjectTimeSheetWebPart extends BaseClientSideWebPart<IProjectTimeSheetWebPartProps> {

  
  public render(): void {
    const element: React.ReactElement<IProjectTimeSheetProps> = React.createElement(
      ProjectTimeSheet,
      {
        absoluteURL: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        context: this.context,
        title: this.properties.title,
        Attachment: this.properties.Attachment
      }
    );

    ReactDom.render(element, this.domElement);
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
