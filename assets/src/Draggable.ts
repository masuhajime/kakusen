
import { _decorator, Component, Node, EventTouch, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Draggable
 * DateTime = Sat Jan 22 2022 22:27:56 GMT+0900 (日本標準時)
 * Author = masuhaji
 * FileBasename = Draggable.ts
 * FileBasenameNoExtension = Draggable
 * URL = db://assets/src/Draggable.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('Draggable')
export class Draggable extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    dragging = false;

    start() {
        console.log("Draggable");
        // this.node.on(Node.EventType.MOUSE_LEAVE, (e: EventTouch) => {
        //     console.log("Node.EventType.MOUSE_LEAVE");
        //     this.dragging = true;
        // })
        // this.node.on(Node.EventType.MOUSE_DOWN, (e: EventTouch) => {
        //     console.log("Node.EventType.MOUSE_DOWN");
        //     this.dragging = true;
        // })
        this.node.on(Node.EventType.MOUSE_DOWN, (e: EventTouch) => {
            console.log("Node.EventType.TOUCH_START");
            this.dragging = true;
        })
        this.node.on(Node.EventType.MOUSE_MOVE, (e: EventTouch) => {
            if (this.dragging) {
                let touchL = e.getUILocation();
                this.node.setPosition(new Vec3(touchL.x, touchL.y, 0))
                // console.log(e);
            }
        })
        this.node.on(Node.EventType.MOUSE_UP, () => {
            console.log("Node.EventType.TOUCH_END");
            this.dragging = false;

        })
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
