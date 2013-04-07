
// CONSTANTS

var ARTY_DENSITY = 1.0;
var ARTY_FRICTION = 1.0;
var ARTY_RESTITUTION = 0.1;
var ARTY_MAX_MOTOR_TORQUE = 1000.0;
var ARTY_MOTOR_SPEED = 2.0;

var FLOOR_DENSITY = 1.0;
var FLOOR_FRICTION = 1.0;
var FLOOR_RESTITUTION = 1.0;

var OBSTACLE_DENSITY = 2.0;
var OBSTACLE_FRICTION = 1.0;
var OBSTACLE_RESTITUTION = 0.5;

var PHONE_DENSITY = 1.0;
var PHONE_FRICTION = 1.0;
var PHONE_RESTITUTION = 1.0;

var TIME_AT_HEAD_MAX = 5;

enchant();

var world = new enchant.box2d.PhysicsWorld(0, 20);

window.onload = function() {
    var game = new Game(800, 600);
    game.fps = 30;
    var haveWon = false;
    game.preload('background.png','hud.png','phone.png',
        'ball.png','newspaper.png',
        'heart.png', 'head.png','torso.png',
        'left_foot.png', 'right_foot.png',
        'left_arm.png','right_arm.png',
        'left_forearm.png','right_forearm.png',
        'left_thigh.png','right_thigh.png',
        'left_calf.png','right_calf.png',
        'WinScreen.png', 'LoseScreen.png',
        'bar.png',
        'arteries.png','arteries_aorta.png',
        'arteries_left_brachial.png','arteries_right_brachial.png',
        'arteries_left_iliac.png','arteries_right_iliac.png',
        'arteries_left_brain.png','arteries_right_brain.png',
        'arteries_left_arm.png','arteries_right_arm.png',
        'arteries_left_leg.png','arteries_right_leg.png',
        'arteries_stomach.png'
    );
    
    var originX = 200, originY = 100;

    game.onload = function() {
        var scene = new Scene();
        game.pushScene(scene);

        var winScene = new Scene(); //This is the win scene
        var winSprite = new enchant.Sprite(800, 600);
        winSprite.image = game.assets["WinScreen.png"];
        winScene.addChild(winSprite);
        
        var loseScene = new Scene(); //This is the lose scene
        var loseSprite = new enchant.Sprite(800, 600);
        loseSprite.image = game.assets["LoseScreen.png"];
        loseScene.addChild(loseSprite);
        
        var background = new enchant.Sprite(800, 600);
        background.image = game.assets["background.png"];
        scene.addChild(background);
       
        var hud = new enchant.Sprite(800, 600);
        hud.image = game.assets["hud.png"];
        scene.addChild(hud);

        var arteries = new cowop.Arteries(250, 0, 450, 180, game.assets["arteries.png"], game, scene, loseScene);

        var oxyMeter = new cowop.OxyMeter(111, 20, game.assets['bar.png'], 0, 155)
        var heart = new cowop.Heart(150, 150, game.assets["heart.png"], game, loseScene, oxyMeter, arteries);
        scene.addChild(heart);
        scene.addChild(oxyMeter);
		
        var floor = new PhyBoxSprite(
            800, 32,
            enchant.box2d.STATIC_SPRITE,
            FLOOR_DENSITY, FLOOR_FRICTION, FLOOR_RESTITUTION,
            true, 2, 3
        );
        floor.position = { x: 400, y: 600 };
        var leftWall = new PhyBoxSprite(
            32, 600,
            enchant.box2d.STATIC_SPRITE,
            FLOOR_DENSITY, FLOOR_FRICTION, FLOOR_RESTITUTION,
            true, 2, 3
        );
        leftWall.position = { x: -16, y: 300 };
        var rightWall = new PhyBoxSprite(
            32, 600,
            enchant.box2d.STATIC_SPRITE,
            FLOOR_DENSITY, FLOOR_FRICTION, FLOOR_RESTITUTION,
            true, 2, 3
        );
        rightWall.position = { x: 816, y: 300 };
        
        // Obstacles
        var ball = new PhyCircleSprite(
            100,
            enchant.box2d.DYNAMIC_SPRITE,
            OBSTACLE_DENSITY, OBSTACLE_FRICTION, OBSTACLE_RESTITUTION,
            true, 2, 3
        );
        ball.image = game.assets["ball.png"];
        ball.position = { x: 600, y: 509 };
        scene.addChild(ball);
        
        var newspaper = new PhyBoxSprite(
            100, 50,
            enchant.box2d.DYNAMIC_SPRITE,
            OBSTACLE_DENSITY, OBSTACLE_FRICTION, OBSTACLE_RESTITUTION,
            true, 2, 3
        );
        newspaper.image = game.assets["newspaper.png"];
        newspaper.position = { x: 300, y: 559 };
        scene.addChild(newspaper);
        
        // Left Limbs
        var leftArm = new PhyBoxSprite(
            32, 81,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        leftArm.position = { x: originX + 11, y: originY + 146.5 };
        leftArm.image = game.assets["left_arm.png"];
        scene.addChild(leftArm);
        
        var leftForearm = new PhyBoxSprite(
            34, 103,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        leftForearm.position = { x: originX +10, y: originY + 217.5 };
        leftForearm.image = game.assets["left_forearm.png"];
        scene.addChild(leftForearm);
        
        var leftThigh = new PhyBoxSprite(
            39, 92,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        leftThigh.position = { x: originX + 9, y: originY + 296.5};
        leftThigh.image = game.assets["left_thigh.png"];
        scene.addChild(leftThigh);
        
        var leftCalf = new PhyBoxSprite(
            48, 87,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        leftCalf.position = { x: originX +9, y: originY + 356.5 };
        leftCalf.image = game.assets["left_calf.png"];
        scene.addChild(leftCalf);
        
        var leftFoot = new PhyBoxSprite(
            60, 40,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        leftFoot.position = { x: originX +23, y: originY + 403 };
        leftFoot.image = game.assets["left_foot.png"];
        scene.addChild(leftFoot);
        
        // Torso
        var torso = new PhyBoxSprite(
            115, 220,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        torso.position = { x: originX, y: originY + 175 };
        torso.image = game.assets["torso.png"];
        scene.addChild(torso);
        
        // Head
        var head = new PhyCircleSprite(
            42.5,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        head.position = { x: originX, y: originY + 42.5 };
        head.image = game.assets["head.png"];
        scene.addChild(head);
        
        // Right Limbs
        var rightArm = new PhyBoxSprite(
            32, 81,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        rightArm.position = { x: originX - 26.5, y: originY + 146.5 };
        rightArm.image = game.assets["right_arm.png"];
        scene.addChild(rightArm);

        var rightForearm = new PhyBoxSprite(
            34, 103,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        rightForearm.position = { x: originX -27.5, y: originY + 217.5 };
        rightForearm.image = game.assets["right_forearm.png"];
        scene.addChild(rightForearm);

        var rightThigh = new PhyBoxSprite(
            39, 92,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        rightThigh.position = { x: originX - 17.5, y: originY + 296.5};
        rightThigh.image = game.assets["right_thigh.png"];
        scene.addChild(rightThigh);

        var rightCalf = new PhyBoxSprite(
            48, 87,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        rightCalf.position = { x: originX -17.5, y: originY + 356.5 };
        rightCalf.image = game.assets["right_calf.png"];
        scene.addChild(rightCalf);

        var rightFoot = new PhyBoxSprite(
            60, 40,
            enchant.box2d.DYNAMIC_SPRITE,
            ARTY_DENSITY, ARTY_FRICTION, ARTY_RESTITUTION,
            true, 1, 2
        );
        rightFoot.position = { x: originX - 3.5, y: originY + 403 };
        rightFoot.image = game.assets["right_foot.png"];
        scene.addChild(rightFoot);
        
        
        // JOINTS
        var neck = new PhyJoint(head, torso, originX + 3.5, originY + 72, -10, 10);
        
        var leftAnkle = new PhyJoint(leftCalf, leftFoot, originX + 5, originY + 388, -10, 70);
        var rightAnkle = new PhyJoint(rightCalf, rightFoot, originX - 21.5, originY + 388, -10, 70);
        
        var leftShoulder = new PhyJoint(leftArm, torso, originX + 10, originY + 115,
          -1, 180, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var leftShoulderClockwise = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "q") {
                leftShoulderClockwise = !leftShoulderClockwise;
                if (leftShoulderClockwise) {
                    leftShoulder.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    leftShoulder.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var rightShoulder = new PhyJoint(rightArm, torso, originX - 27.5, originY + 115,
          -45, 180, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var rightShoulderClockwise = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "e") {
                rightShoulderClockwise = !rightShoulderClockwise;
                if (rightShoulderClockwise) {
                    rightShoulder.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    rightShoulder.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var leftElbow = new PhyJoint(leftForearm, leftArm, originX + 10, originY + 176,
          -45, 135, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var leftElbowExtend = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "w") {
                leftElbowExtend = !leftElbowExtend;
                if (leftElbowExtend) {
                    leftElbow.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    leftElbow.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var rightElbow = new PhyJoint(rightForearm, rightArm, originX - 27.5, originY + 176,
          -1, 135, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var rightElbowExtend = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "r") {
                rightElbowExtend = !rightElbowExtend;
                if (rightElbowExtend) {
                    rightElbow.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    rightElbow.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var leftHip = new PhyJoint(leftThigh, torso, originX + 10, originY + 255,
          -30, 135, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var leftHipClockwise = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "v") {
                leftHipClockwise = !leftHipClockwise;
                if (leftHipClockwise) {
                    leftHip.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    leftHip.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var rightHip = new PhyJoint(rightThigh, torso, originX - 16.5, originY + 255,
          -30, 135, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var rightHipClockwise = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "n") {
                rightHipClockwise = !rightHipClockwise;
                if (rightHipClockwise) {
                    rightHip.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    rightHip.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var leftKnee = new PhyJoint(leftCalf, leftThigh, originX + 10, originY + 323,
          -135, 1, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var leftKneeExtend = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "b") {
                leftKneeExtend = !leftKneeExtend;
                if (leftKneeExtend) {
                    leftKnee.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    leftKnee.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        var rightKnee = new PhyJoint(rightCalf, rightThigh, originX - 16.5, originY + 323,
          -135, 1, // lowerAngle, upperAngle
          ARTY_MAX_MOTOR_TORQUE, ARTY_MOTOR_SPEED // maxMotorTorque, motorSpeed
        );
        var rightKneeExtend = true;
        cowop.keyPressListeners.push(function (key) {
            if (key == "m") {
                rightKneeExtend = !rightKneeExtend;
                if (rightKneeExtend) {
                    rightKnee.m_joint.SetMotorSpeed(ARTY_MOTOR_SPEED)
                } else {
                    rightKnee.m_joint.SetMotorSpeed(-ARTY_MOTOR_SPEED)
                }
            }
        });
        
        // PHONE
        var phone = new PhyBoxSprite(
            85, 25,
            enchant.box2d.STATIC_SPRITE,
            PHONE_DENSITY, PHONE_FRICTION, PHONE_RESTITUTION,
            true, 1, 2
        );
        phone.image = game.assets["phone.png"];
        phone.position = { x: 690, y: 250 };
        scene.addChild(phone);
        var phoneInHand = false;
        var timeAtHead = 0;
        scene.addEventListener(enchant.Event.ENTER_FRAME, function (e) {
            if (phoneInHand) {
                var hd = Math.pow(phone.x - head.x, 2) + Math.pow(phone.y - head.y, 2);
                if (hd < 42.5*42.5) {
                    timeAtHead += e.elapsed/1000;
                } else {
                    timeAtHead = 0;
                };
                if (timeAtHead > TIME_AT_HEAD_MAX && !haveWon) {
                    pushScene(winScene);
                    haveWon = true;
                };
            } else {
                var ld = Math.pow(phone.x - leftForearm.x, 2) + Math.pow(phone.y - leftForearm.y, 2)
                var rd = Math.pow(phone.x - rightForearm.x, 2) + Math.pow(phone.y - rightForearm.y, 2)
                if (ld < 8*8) {
                    phoneInHand = true;
                    phone.type = b2Body.b2_dynamicBody;
                    phone.sleep = false;
                    var j = new PhyJoint(phone, leftForearm, phone.x, phone.y, -1, 1);
                } else if (rd < 8*8) {
                    phoneInHand = true;
                    phone.type = b2Body.b2_dynamicBody;
                    phone.sleep = false;
                    var j = new PhyJoint(phone, rightForearm, phone.x, phone.y, -1, 1);
                }
            }
        });
                
        scene.addEventListener("enterframe", function () {
            // Update joint motors
            var max = ARTY_MAX_MOTOR_TORQUE;
            leftShoulder.m_joint.SetMaxMotorTorque(max*arteries.leftArm.oxygenation);
            rightShoulder.m_joint.SetMaxMotorTorque(max*arteries.rightArm.oxygenation);
            leftElbow.m_joint.SetMaxMotorTorque(max*arteries.leftArm.oxygenation);
            rightElbow.m_joint.SetMaxMotorTorque(max*arteries.rightArm.oxygenation);
            leftHip.m_joint.SetMaxMotorTorque(max*arteries.leftLeg.oxygenation);
            rightHip.m_joint.SetMaxMotorTorque(max*arteries.rightLeg.oxygenation);
            leftKnee.m_joint.SetMaxMotorTorque(max*arteries.leftLeg.oxygenation);
            rightKnee.m_joint.SetMaxMotorTorque(max*arteries.rightLeg.oxygenation);
            
            // Update the physics simulation
            world.step(game.fps);
        });
    };
    
    game.start();
};
