import * as React from 'react';
import { C, simple_application, string, button, repeat, any, unit } from 'monadic_react';


const options_buttons : C<string> = any<{},string>('allmybuttons')(
  ['This','That','Again This','Someone'].map((s,i) => (_ : {}) => button<string>(s,false,`btn-${i}`)(s) )
)({})

type HomeState = { title: string, subtitle: string }

export class Home extends React.Component<{}, HomeState> {
  constructor(props:{}){
    super(props)
    this.state = { title: "everybody", subtitle: "Choose a button to change what you see here" }
  }

  render() {
        return <div>
            <h1>Hello, {this.state.title}!</h1>
            <h3>{this.state.subtitle}</h3>
            { simple_application<string>(repeat<string>('repedit')(string('edit',"text",'editslot'))(this.state.title)
            .then<string>('passtobutton',button<string>('Pass it up',false,'passitup'))
            ,s => this.setState({...this.state, title: s})) }
            {simple_application<string>(options_buttons,s => this.setState({...this.state,subtitle:s}))}
        </div>;
    }
}
