import * as React from 'react';
import { C, simple_application, string, button, repeat, any, unit } from 'monadic_react';


type HomeState = { title: string }

export class Home extends React.Component<{}, HomeState> {
  constructor(props:{}){
    super(props)
    this.state = { title: "everybody" }
  }

  render() {
        return <div>
            <h1>Hello, {this.state.title}!</h1>
            { simple_application<string>(repeat<string>('repedit')(string('edit',"text",'editslot'))(this.state.title)
            .then<string>('passtobutton',button<string>('Pass it up',false,'passitup'))
            ,s => this.setState({...this.state, title: s})) }
        </div>;
    }
}
