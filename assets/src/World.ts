
import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, TiledMap, TiledLayer, TiledObjectGroup, EventTouch, RigidBody2D, RigidBody, CircleCollider2D, Vec2, Vec3, EventMouse, Prefab, resources, Asset, instantiate, Collider2D, MaskComponent, Graphics, Color, GraphicsComponent, View, director, Canvas, CanvasComponent, UITransform, Rect } from 'cc';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = World
 * DateTime = Sat Jan 22 2022 14:23:12 GMT+0900 (日本標準時)
 * Author = masuhaji
 * FileBasename = World.ts
 * FileBasenameNoExtension = World
 * URL = db://assets/src/World.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('World')
export class World extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    prefabBall: Prefab;
    rect: Rect;

    nodeFingerRight: Node;
    nodeFingerLeft: Node;

    start() {
        // [3]

        PhysicsSystem2D.instance.enable = true;
        if (!true) {
            PhysicsSystem2D.instance.debugDrawFlags =
                EPhysics2DDrawFlags.All |
                EPhysics2DDrawFlags.Aabb |
                EPhysics2DDrawFlags.Pair |
                EPhysics2DDrawFlags.CenterOfMass |
                EPhysics2DDrawFlags.Joint |
                EPhysics2DDrawFlags.Shape;
        }

        const canvas = director.getScene().getChildByName('Canvas')
        const cc = canvas.getComponent(UITransform)
        this.rect = cc.getBoundingBox();

        this.nodeFingerRight = this.node.getChildByPath('objects/finger-right/finger-0')
        this.nodeFingerLeft = this.node.getChildByPath('objects/finger-left/finger-0')

        this.node.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {
            const lr = (this.rect.width / 2) < e.getStartLocation().x ? 'right' : 'left';
            // if (e.getStartLocation().x)
            // console.log(e.getStartLocation());
            switch (lr) {
                case "left":
                    {
                        const rb2d = this.nodeFingerLeft.getComponent(RigidBody2D)
                        const power = 5000;
                        rb2d.applyForceToCenter(
                            e.getLocation().clone().subtract(e.getPreviousLocation()).multiply(new Vec2(power, power)),
                            true
                        );
                    }
                    break;
                case "right":
                    {
                        const rb2d = this.nodeFingerRight.getComponent(RigidBody2D)
                        const power = 5000;
                        rb2d.applyForceToCenter(
                            e.getLocation().clone().subtract(e.getPreviousLocation()).multiply(new Vec2(power, power)),
                            true
                        );
                    }
                    break;
            }


            //console.log("loc", e.getLocation(), e.getLocationInView(), e.getUILocation());
        })
    }

    // update(deltaTime: number) {
    //     const n0 = this.node.getChildByPath('objects/static')
    //     const n1 = this.node.getChildByPath('objects/n1')
    //     const n2 = this.node.getChildByPath('objects/n2')

    //     this.drawPolygon([
    //         { x: n0.position.x, y: n0.position.y },
    //         { x: n1.position.x, y: n1.position.y },
    //         { x: n2.position.x, y: n2.position.y }
    //     ],
    //         this.node.getChildByPath('objects/skin/graphic')
    //         //this.node.getChildByPath('objects/Node/Graphics')

    //     )
    // }
}
