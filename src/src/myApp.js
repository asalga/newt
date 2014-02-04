// TODO: fix
world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, -10));

var selectedSprite = null;

var Helloworld = cc.Layer.extend({
    isMouseDown: false,
    floorPart: null,
    layer: null,
    myBrush: null,
    lastMousePos: [0, 0],

    init: function () {
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        /*var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);*/

        //var menu = cc.Menu.create(closeItem);
        //menu.setPosition(0,0);
        //this.addChild(menu, 1);
        //closeItem.setPosition(size.width - 20, 20);

        // Add a light blue bk instead of black that makes gui hard to see.
        this.addChild(cc.LayerColor.create(cc.c4b(200, 255, 255, 255)));

        // this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        // this.helloLabel.setPosition(size.width / 2, 0);
        // add the label as a child to this layer
        // this.addChild(this.helloLabel, 5);

        layer = cc.Layer.create();
        this.addChild(layer);

        // add "HelloWorld" splash screen"
        //this.sprite = cc.Sprite.create("res/HelloWorld.png");
        //this.sprite.setPosition(size.width / 2, size.height / 2);
        //this.sprite.setScale(0.5);
        //this.sprite.setRotation(180);

        //layer.addChild(this.sprite, 0);
        //var rotateToA = cc.RotateTo.create(2, 0);
        //var scaleToA = cc.ScaleTo.create(2, 1, 1);

        //this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        //this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));
        this.schedule(this.update);
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.setMouseEnabled(true);

        return true;
    },
    /*
     */
    getBrushCoords: function () {
        if (mainControls.snapToGrid) {
            return [Math.floor((this.lastMousePos[0] + 32) / PTM) * PTM, Math.floor((this.lastMousePos[1] + 32) / PTM) * PTM];
        }
        return [this.lastMousePos[0], this.lastMousePos[1]];
    },
    update: function (dt) {
        if (mainControls.isRunning) {
            world.Step(1 / 60, 1, 1);
        }
    },
    /*
        When the user changes the dropdown, this gets called.

        This also gets called when the user clicks the screen.
    */
    setBrush: function () {
        console.log("setBrush()");

        if (mainControls.brush === 'none') {
            if (this.myBrush) {
                layer.removeChild(this.myBrush);
                this.myBrush = null;
            }
        } else {
            var p = this.getBrushCoords();

            var obj = new CTObject("res/" + mainControls.brush + ".png");
            obj.getBody().SetPosition(new Box2D.Common.Math.b2Vec2(p[0] / PTM, p[1] / PTM));
            obj.scheduleUpdate();
            ""
            obj.getBody().SetAwake(false);
            obj.getBody().SetActive(false);

            layer.addChild(obj, 0);
            this.myBrush = obj;
        }
    },
    /*
        When is this called?
    */
    createSpriteFromBrush: function (brush) {

        if (this.myBrush) {
            if (mainControls.isDynamic) {
                this.myBrush.getBody().SetType(Box2D.Dynamics.b2Body.b2_dynamicBody);
            } else {
                this.myBrush.getBody().SetType(Box2D.Dynamics.b2Body.b2_staticBody);
            }
            this.myBrush.getBody().SetAwake(true);
            this.myBrush.getBody().SetActive(true);

            var p = this.getBrushCoords();

            this.setBrush();
        }

        // var obj = new CTObject();
        // obj.getBody().SetPosition(new Box2D.Common.Math.b2Vec2(this.lastMousePos[0]/PTM, this.lastMousePos[1]/PTM));
        // obj.scheduleUpdate();
        // this.myBrush = obj;
    },
    /*
        Move the brush, everytime
    */
    onMouseMoved: function (event) {
        //
        this.lastMousePos[0] = event._point.x;
        this.lastMousePos[1] = event._point.y;

        var p = this.getBrushCoords();
        if (this.myBrush) {
            this.myBrush.getBody().SetPosition(new Box2D.Common.Math.b2Vec2(p[0] / PTM, p[1] / PTM));
            this.myBrush.getBody().SetAngle(0);
        }
    },
    menuCloseCallback: function (sender) {
        cc.Director.getInstance().end();
    },
    /*
     */
    onTouchesBegan: function (touches, event) {

        // If there is a brush selected, and the user touched, we need to
        // drop the current one the user is holding and make another one so they can
        // properly draw many boxes quickly w/o selecting the brush again from the dropdown.
        if (this.myBrush) {
            console.log("onTouchesBegan()");
            //this.myBrush.getBody().SetPosition()
            this.createSpriteFromBrush('nothing fix me');
            //return;
        }
        // The user is not holding onto a brush, that means, they want to select
        // a sprite from the scene.
        else {
            var b = world.GetBodyList()

            this.isMouseDown = true;
            var p = touches[0]._point;

            selectedSprite = null;

            for (; b != null; b = b.m_next) {
                //if(b.GetUserData().testPoint(new Box2D.Common.Math.b2Vec2(p.x/PTM, p.y/PTM))){
                var test = b.GetUserData();

                if (test) {
                    if (test.testPoint(new Box2D.Common.Math.b2Vec2(p.x / PTM, p.y / PTM))) {
                        selectedSprite = test;
                        test.setSelected(true);
                        // return;
                    } else {
                        test.setSelected(false);

                    }
                }
            }

            if (selectedSprite) {
                object.open();
                return;
            }
        }

        return;

        object.close();

        if (mainControls.snapToGrid) {
            p.x = Math.floor(p.x / 64) * 64;
            p.y = Math.floor(p.y / 64) * 64;
        }

        var obj = new CTObject(brush);
        obj.getBody().SetPosition(new Box2D.Common.Math.b2Vec2(p.x / PTM, p.y / PTM));
        obj.scheduleUpdate();

        this.myBrush = obj;

        layer.addChild(obj, 0);

        if (mainControls.isDynamic == false) {
            obj.getBody().SetType(Box2D.Dynamics.b2Body.b2_staticBody);
        }
    },
    onTouchesMoved: function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    /*
        Keyboard shortcuts to help editing
    */
    onKeyUp: function (keyCode) {
        // User hits escape key to get rid of the current brush.

        // This will not get called if the DAT.GUI control has focus!
        if (keyCode === 27) {
            if (this.myBrush) {
                console.log("ESC KEY");
                layer.removeChild(this.myBrush);
                this.myBrush = null;
                brushControl.setValue("none");
            }
        }

        // 'x' key used to delete current sprite
        if (keyCode === 88) {
            if (selectedSprite) {
                layer.removeChild(selectedSprite);
                selectedSprite = null;
                //layer.cleanup(); // crap, don't call this.
            }
        }
    },
    onKeyDown: function (keyCode) {},
    onTouchesEnded: function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});