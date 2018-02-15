import * as React from 'react';
import { C, simple_application, string, button, repeat, any, unit, lift_promise, div } from 'monadic_react';



export type MyTask = { id: number, title: string, tascollId: number }
export type Urgent = { id: number, title: string, tascollId: number }
export type Tascoll = { id: number, title: string, urgInner: Urgent[], inner: MyTask[] }
export type Everything = { priority: Urgent[], myCollections: Tascoll[] }
export type SimpleColl = { id: number, title: string }
export type Minimal = { priority: Urgent[], simpleCollections: SimpleColl[] }


type EditToggleState = { mode: 'view' | 'edit', task: string }


const edit_save : (key:string) => (_:EditToggleState) => C<EditToggleState> = key => repeat<EditToggleState>('repeat-edittoggle-' + key)(ed =>
  ed.mode == 'view' ? any<{}, EditToggleState>(`viewmode-` + key)([
    _ => string('view', 'text', `actual-view-` + key)(ed.task).never<EditToggleState>(),
    _ => button<EditToggleState>('Edit', false, `wanna-edit-` + key)({...ed, mode:'edit'})
  ])({})
    : any<{}, EditToggleState>(`editmode-` + key,'col-sm-2')([
      _ => string('edit', 'text', `actual-edit-` + key)(ed.task).then<EditToggleState>('passthechange-' + key,s => unit<EditToggleState>({mode:'edit',task:s})),
      _ => button<EditToggleState>('Save', ed.task == '', `wanna-edit-` + key)({ ...ed, mode: 'view' })
    ])({})
)







const later = function<A>(key?:string) : C<A> {
  return string('view','text',key)("I will do this later").never<A>()
}





const show_edit_MyTask: (_: MyTask) => C<{}> = ur => any<{}, {}>(`MyTask-task-${ur.id}-${ur.tascollId}`)([
  _ => edit_save(`${ur.id}-${ur.tascollId}`)({ mode: 'view', task: ur.title }).filter(ed => ed.mode == 'view', `onlyaftersavenormal-${ur.id}-${ur.tascollId}`).ignore_with<{}>({}),
  _ => button<{}>('Delete', false, `del-btn-${ur.id}-${ur.tascollId}`)({}).then<{}>(`passdel-${ur.id}-${ur.tascollId}`, _ =>
    lift_promise<string, {}>(s => fetch(s, { method: 'DELETE' }), 'never', `actual-del-action-${ur.id}-${ur.tascollId}`)(`api/DataCollector/RemoveTask/${ur.id}`)
  )
])({})



const show_edit_urgent: (_: Urgent) => C<{}> = ur => any<{}, {}>(`urgent-task-${ur.id}-${ur.tascollId}`)([
  _ => edit_save(`${ur.id}-${ur.tascollId}`)({ mode: 'view', task: ur.title }).filter(ed => ed.mode == 'view', `onlyaftersave-${ur.id}-${ur.tascollId}`).ignore_with<{}>({}),
  _ => button<{}>('Delete', false, `del-btn-${ur.id}-${ur.tascollId}`)({}).then<{}>(`passdel-${ur.id}-${ur.tascollId}`,_ =>
    lift_promise<string, {}>(s => fetch(s,{method:'DELETE'}), 'never', `actual-del-action-${ur.id}-${ur.tascollId}`)(`api/DataCollector/RemoveUrgent/${ur.id}`)
  )
])({})
//temporarily simpler
//string('view','text',`infourgent-${ur.id}-${ur.tascollId}`)(ur.title).never<{}>(`just-view-urgent-${ur.id}-${ur.tascollId}`)


const inner_normal_list: (_: MyTask[]) => C<{}> = urs => any<{}, {}>('allnormals', 'row')(urs.map(
  u => (_: {}) => show_edit_MyTask(u)
))({})

const inner_priority_list : (_:Urgent[]) => C<{}> = urs => any<{},{}>('allurgents','row')(urs.map(
  u => (_:{}) => show_edit_urgent(u)
))({})


const priority_list: (_: Urgent[]) => C<{}> = urs => any<{},{}>('fullpriority','row')([
  _ => div<string,string>(undefined,'prioritytitle')(string('view','text','actualtitle'))('Priority List').never<{}>('neverreturn'),
  _ => inner_priority_list(urs == null ? [] : urs)
])({})


const sublist_urgents: (key: number) => (_: Urgent[]) => C<{}> = key => urs => any<{}, {}>('priority-' + `${key}`, 'row')([
  _ => div<string, string>(undefined, 'prioritytitle' + `${key}`)(string('view', 'text', 'actualtitle' + `${key}`))('Urgent Tasks').never<{}>('neverreturnurgents' + `${key}`),
  _ => button<{}>('Add Urgent', false, `addurgent-${key}`)({}).then<{}>(`proceedwithadding${key}`, _ =>
    lift_promise<string, {}>(s => fetch(s, { method: 'POST' }), 'never', `actualadding${key}`)(`api/DataCollector/NewUrgent/${key}`)),
  _ => inner_priority_list(urs == null ? [] : urs)
])({})

const sublist_normals: (key: number) => (_: MyTask[]) => C<{}> = key => urs => any<{}, {}>('normal-' + `${key}`, 'row')([
  _ => div<string, string>(undefined, 'normals' + `${key}`)(string('view', 'text', 'actualnormals' + `${key}`))('Normal Tasks').never<{}>('neverreturnnormals' + `${key}`),
  _ => button<{}>('Add Task', false, `addtask-${key}`)({}).then<{}>(`proceedwithaddingtask${key}`, _ =>
    lift_promise<string, {}>(s => fetch(s, { method: 'POST' }), 'never', `actualaddingtask${key}`)(`api/DataCollector/NewTask/${key}`)),
  _ => inner_normal_list(urs == null ? [] : urs)
])({})



const collection : (_:Tascoll) => C<{}> = coll => any<{},{}>(`showcollection-${coll.id}`,'row')([
  _ => div<string, string>(undefined, `collectiontitle-${coll.id}`)(string('view', 'text', `actualtitle-${coll.id}`))(coll.title).never<{}>('neverreturn'),
  _ => button<{}>('Delete Collection', false, `delcoll-btn-${coll.id}`)({}).then<{}>(`passdel-${coll.id}`, _ =>
    lift_promise<string, {}>(s => fetch(s, { method: 'DELETE' }), 'never', `actual-del-action-${coll.id}`)(`api/DataCollector/RemoveCollection/${coll.id}`)),
  _ => sublist_urgents(coll.id)(coll.urgInner),
  _ => sublist_normals(coll.id)(coll.inner)
])({})






export const stuff = repeat<{}>('hello')(_ => lift_promise<{}, Everything>(_ => fetch(`api/DataCollector/everything`).then(res => res.json() as Promise<Everything>),'never','todolist')({})
  .then<{}>('useallthis', ev => any<{},{}>('showmeeverything')([
    _ => priority_list(ev.priority),
    _ => button<{}>('New Collection',false,'addcollection')({}).then<{}>('proceedwithadding',_ =>
      lift_promise<string, {}>(s => fetch(s, { method: 'POST' }), 'never', 'actualadding')('api/DataCollector/NewCollection') ),
    ...(ev.myCollections.map(coll => (_:{}) => collection(coll) ))
  ])({})
))({})
//priority_list([])
//later('later')