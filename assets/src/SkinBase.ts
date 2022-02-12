
import { _decorator, Component, Node, SpringJoint2D, RigidBody2D, ERigidBodyType, ERigidBody2DType, Graphics, GraphicsComponent, DistanceJoint2D, Vec3, CircleCollider2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SkinBase
 * DateTime = Sun Jan 23 2022 18:02:42 GMT+0900 (日本標準時)
 * Author = masuhaji
 * FileBasename = SkinBase.ts
 * FileBasenameNoExtension = SkinBase
 * URL = db://assets/src/SkinBase.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('SkinBase')
export class SkinBase extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    //const objects = this.node.getChildByPath('objects');

    nodesSkinCells: Node[] = [];
    nodesSupportCells: Node[] = [];
    nodesKakusen: Node[] = [];

    start() {
        // [3]
        const pointsNode = this.node.getChildByName('points')
        const width = 720;
        const cellDistance = 24;
        const cellPadding = 4;
        const cellAmount = (width / cellDistance) + cellPadding + 1;
        // sp = Start Point
        const sp = new Vec3(
            (cellAmount - 1) / 2 * cellDistance * -1
            , 0, 0);

        // 座標の作成
        const nBottomLeft = new Node();
        nBottomLeft.setPosition(new Vec3(0 + sp.x, -700 + sp.y, 0));
        this.nodesSkinCells.push(nBottomLeft)
        for (let i = 0; i < cellAmount; i++) {
            const n = new Node();
            n.setPosition(new Vec3(sp.x + i * cellDistance, sp.y, 0));
            this.nodesSkinCells.push(n)
        }
        const nBottomRight = new Node();
        nBottomRight.setPosition(new Vec3(sp.x + (cellAmount - 1) * cellDistance, -700 + sp.y, 0));
        this.nodesSkinCells.push(nBottomRight)

        // 角栓の穴を作成 start
        const kakusenPosition = 19;
        this.nodesSkinCells[kakusenPosition - 1].position = this.nodesSkinCells[kakusenPosition - 1].position.add(new Vec3(-cellDistance * 0.5, 0, 0))
        this.nodesSkinCells[kakusenPosition + 0].position = this.nodesSkinCells[kakusenPosition + 0].position.add(new Vec3(-cellDistance * 0.8, 0, 0))
        this.nodesSkinCells[kakusenPosition + 1].position = this.nodesSkinCells[kakusenPosition + 1].position.add(new Vec3(+cellDistance * 0.8, 0, 0))
        this.nodesSkinCells[kakusenPosition + 2].position = this.nodesSkinCells[kakusenPosition + 2].position.add(new Vec3(+cellDistance * 0.5, 0, 0))

        const kakusenHoleCenter = this.nodesSkinCells[kakusenPosition].position.clone().add(this.nodesSkinCells[kakusenPosition + 1].position)
        const kakusenHolePositions = [
            [-40, -30],// ここの数は偶数にする
            [-50, -80],
            [-60, -130],
            [-15, -150],
            [15, -150],
            [60, -130],
            [50, -80],
            [40, -30],
        ]
        for (let i = 0; i < kakusenHolePositions.length; i++) {
            const kakusenCell = new Node();
            kakusenCell.setPosition(new Vec3(
                kakusenHoleCenter.x / 2 + kakusenHolePositions[i][0],
                kakusenHoleCenter.y / 2 + kakusenHolePositions[i][1],
                kakusenHoleCenter.z / 2
            ));
            this.nodesSkinCells.splice(kakusenPosition + i + 1, 0, kakusenCell);
        }
        // 角栓の穴を作成 end

        // 角栓作成 start
        const nodesKakusenPositions = [
            [0, 0],
            [-10, -30],
            [-20, -50],
            [-5, -70],
            [5, -70],
            [20, -50],
            [10, -30],
            [0, 0],
        ];
        for (let i = 0; i < nodesKakusenPositions.length; i++) {
            let node = new Node();
            this.nodesKakusen.push(node)
            node.setPosition(kakusenHoleCenter.clone().add(new Vec3(
                nodesKakusenPositions[i][0],
                nodesKakusenPositions[i][1] - 40
            )));
            const rb2d = node.addComponent(RigidBody2D);
            rb2d.angularDamping = 2;
            const cc2d = node.addComponent(CircleCollider2D);
            cc2d.radius = 24;
            cc2d.friction = 1;
            cc2d.restitution = 0;
        }
        for (let i = 0; i < this.nodesKakusen.length; i++) {
            const currentNode = this.nodesKakusen[i];
            let connectNodeIndex = i + 1;
            if (connectNodeIndex >= this.nodesKakusen.length) {
                connectNodeIndex = 0;
            }
            const connectNode = this.nodesKakusen[connectNodeIndex];
            const springJoint = currentNode.addComponent(SpringJoint2D)
            springJoint.connectedBody = connectNode.getComponent(RigidBody2D)

            const distanceJoint = currentNode.addComponent(DistanceJoint2D)
            const distance = Vec3.distance(currentNode.position, connectNode.position);
            distanceJoint.connectedBody = connectNode.getComponent(RigidBody2D)
            distanceJoint.maxLength = distance * 1.5;
        }
        for (let i = 0; i < this.nodesKakusen.length; i++) {
            this.node.addChild(this.nodesKakusen[i])
        }
        // 角栓作成 end

        // pin + spring joint
        for (let i = 0; i < this.nodesSkinCells.length; i++) {
            const node = this.nodesSkinCells[i];

            const currentNodeRigid = node.addComponent(RigidBody2D);
            currentNodeRigid.fixedRotation = true;
            currentNodeRigid.type = ERigidBody2DType.Dynamic;
            currentNodeRigid.group = 1

            const circleCollider2D = node.addComponent(CircleCollider2D);
            circleCollider2D.radius = 24;
            circleCollider2D.density = 0.1;
            circleCollider2D.friction = 0;
            circleCollider2D.restitution = 0;

            const pinNode = new Node();
            const pinRigidBody2D = pinNode.addComponent(RigidBody2D)
            pinRigidBody2D.type = ERigidBody2DType.Static;
            pinRigidBody2D.fixedRotation = true;
            const springJointPin = pinNode.addComponent(SpringJoint2D)
            springJointPin.connectedBody = currentNodeRigid;
            // springJointPin.autoCalcDistance = false;
            //springJointPin.distance = 0;
            springJointPin.frequency = 5;
            springJointPin.dampingRatio = 2;
            node.addChild(pinNode)

            this.node.addChild(node);
            if (i == 0) {
                continue;
            }

            // Joint between skin
            const springJoint = node.addComponent(SpringJoint2D)
            const nodePrevious = this.nodesSkinCells[i - 1];
            springJoint.connectedBody = nodePrevious.getComponent(RigidBody2D)
            //springJoint.collideConnected = true;

            const distanceJoint = node.addComponent(DistanceJoint2D)
            distanceJoint.connectedBody = nodePrevious.getComponent(RigidBody2D)

            const distance = Vec3.distance(node.position, nodePrevious.position);
            distanceJoint.autoCalcDistance = false;
            //distanceJoint.collideConnected = true;
            distanceJoint.maxLength = distance * 1.5;
        }

        const supportCellAmount = 5;
        const supportCellDistance = 720 / supportCellAmount;
        const supportCellDepth = 300;
        const supportCellStartPoint = new Vec3(Math.floor(supportCellAmount / 2) * supportCellDistance * -1, -supportCellDepth, 0);
        for (let i = 0; i < supportCellAmount; i++) {
            const n = new Node();
            const supportRigidBody = n.addComponent(RigidBody2D);
            n.setPosition(new Vec3(
                supportCellStartPoint.x + i * supportCellDistance,
                supportCellStartPoint.y,
                supportCellStartPoint.z
            ))
            this.nodesSupportCells.push(n)

            const pinNode = new Node();
            const pinRigidBody2D = pinNode.addComponent(RigidBody2D)
            pinRigidBody2D.type = ERigidBody2DType.Static;
            pinRigidBody2D.fixedRotation = true;
            const springJointPin = pinNode.addComponent(SpringJoint2D)
            springJointPin.connectedBody = supportRigidBody;

            springJointPin.frequency = 2;
            springJointPin.dampingRatio = 10;
            n.addChild(pinNode);
            this.node.addChild(n)

            this.nodesSkinCells.forEach(points => {
                const springJointPin = points.addComponent(SpringJoint2D)
                springJointPin.connectedBody = n.getComponent(RigidBody2D);
                springJointPin.frequency = 3;// 弾力
                springJointPin.dampingRatio = 1;
            })
        }


        if (false) {
            for (let i = 0; i < pointsNode.children.length; i++) {
                const currentNodeRigid = pointsNode.children[i].getComponent(RigidBody2D);
                currentNodeRigid.fixedRotation = true;

                const pinNode = new Node();
                const pinRigidBody2D = pinNode.addComponent(RigidBody2D)
                pinRigidBody2D.type = ERigidBody2DType.Static;
                pinRigidBody2D.fixedRotation = true;
                const springJointPin = pinNode.addComponent(SpringJoint2D)
                springJointPin.connectedBody = currentNodeRigid;
                // springJointPin.autoCalcDistance = false;
                //springJointPin.distance = 0;
                springJointPin.frequency = 5;
                springJointPin.dampingRatio = 2;
                pointsNode.children[i].addChild(pinNode)

                if (i == 0) {
                    continue;
                }

                // Joint between skin
                const springJoint = pointsNode.children[i].addComponent(SpringJoint2D)
                const nodePrevious = pointsNode.children[i - 1];
                springJoint.connectedBody = nodePrevious.getComponent(RigidBody2D)
                //springJoint.collideConnected = true;

                const distanceJoint = pointsNode.children[i].addComponent(DistanceJoint2D)
                distanceJoint.connectedBody = nodePrevious.getComponent(RigidBody2D)

                const distance = Vec3.distance(pointsNode.children[i].position, nodePrevious.position);
                distanceJoint.autoCalcDistance = false;
                //distanceJoint.collideConnected = true;
                distanceJoint.maxLength = distance * 1.5;
            }


            const supportsNode = this.node.getChildByName('supports')
            supportsNode.children.forEach(support => {
                const pinNode = new Node();
                const pinRigidBody2D = pinNode.addComponent(RigidBody2D)
                pinRigidBody2D.type = ERigidBody2DType.Static;
                pinRigidBody2D.fixedRotation = true;
                const springJointPin = pinNode.addComponent(SpringJoint2D)

                springJointPin.connectedBody = support.getComponent(RigidBody2D);
                // springJointPin.distance = 0;
                springJointPin.frequency = 2;
                springJointPin.dampingRatio = 10;
                support.addChild(pinNode)

                const currentNodeRigid = support.getComponent(RigidBody2D);
                currentNodeRigid.fixedRotation = true;

                pointsNode.children.forEach(points => {
                    const springJointPin = points.addComponent(SpringJoint2D)
                    springJointPin.connectedBody = support.getComponent(RigidBody2D);
                    springJointPin.frequency = 5;// 弾力
                    springJointPin.dampingRatio = 3;

                })
            })
        }
    }

    drawPolygon(pointArr: { x: number, y: number }[], node, isAppended = false) {
        const g: Graphics = node.getComponent(GraphicsComponent);
        g.miterLimit = 1;
        g.lineCap = Graphics.LineCap.ROUND;
        g.lineJoin = Graphics.LineJoin.ROUND;
        const ox = -0;
        const oy = -0;
        if (!isAppended) { g.clear(); }
        g.moveTo(pointArr[0].x + ox, pointArr[0].y + oy);
        // pointArr.map(p => {
        //     g.lineTo(p.x + ox, p.y + oy);
        // })
        for (let i = 1; i < pointArr.length - 1; i += 2) {
            g.quadraticCurveTo(pointArr[i].x, pointArr[i].y,
                pointArr[i + 1].x, pointArr[i + 1].y)
        }
        // for (let i = 2; i < pointArr.length - 2; i += 2) {
        //     g.bezierCurveTo(pointArr[i - 1].x, pointArr[i - 1].y,
        //         pointArr[i + 0].x, pointArr[i + 0].y,
        //         pointArr[i + 1].x, pointArr[i + 1].y)
        // }
        g.lineTo(pointArr[pointArr.length - 1].x + ox, pointArr[pointArr.length - 1].y + oy);
        g.close();
        g.stroke();
        g.fill();
    }

    update(deltaTime: number) {
        //const draw = this.node.getChildByName('draw')

        // console.log("skinbase");

        // const pointsNode = this.node.getChildByName('points')
        // let points = [];

        // pointsNode.children.forEach(point => {
        //     points.push({
        //         x: point.position.x,
        //         y: point.position.y
        //     })
        // })

        let points = [];
        this.nodesSkinCells.forEach(point => {
            points.push({
                x: point.position.x,
                y: point.position.y
            })
        })
        // console.log(points);
        this.drawPolygon(points, this.node.getChildByPath('graphic'))

        points = [];
        this.nodesKakusen.forEach(point => {
            points.push({
                x: point.position.x,
                y: point.position.y
            })
        })
        // console.log(points);
        this.drawPolygon(points, this.node.getChildByPath('graphic_kakusen'))
    }
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
