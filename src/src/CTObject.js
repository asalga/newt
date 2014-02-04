var PTM = 64;

var CTObject = cc.Sprite.extend({
    _curentRotation: 0,
    isSelected: false,
    fixture: null,
    body: null,

    /*
     */
    ctor: function (img) {
        this._super();
        this.initWithFile(img);

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

        this.body = world.CreateBody(bodyDef);
        //this.body.SetPosition(new Box2D.Common.Math.b2Vec2(320/PTM,240/PTM));
        this.body.m_UserData = this;
        this.body.SetUserData(this);

        var shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsBox(0.5, 0.5);

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.shape = shape;

        fixture = this.body.CreateFixture(fixtureDef);
    },
    onExit: function () {
        world.DestroyBody(this.body);
    },
    setSelected: function (s) {
        this.isSelected = s;
        if (s) {
            this.setColor(cc.c3(0, 255, 0));
        } else {
            this.setColor(cc.c3(255, 255, 255));
        }
    },
    getBody: function () {
        return this.body;
    },
    /*
        When the user taps the screen, we have to check to see
        if they hit a sprite.
    */
    testPoint: function (p) {
        for (var f = this.body.GetFixtureList(); f != null; f = f.m_next) {
            if (f.TestPoint(p)) {
                return true;
            }
        }
        return false;
    },
    /*
        Set the sprite position and rotation based on the box2d variables.
    */
    update: function (dt) {
        this.setRotation(-this.body.GetAngle() / 3.1415926 * 180);
        this.setPosition(this.body.GetPosition().x * PTM, this.body.GetPosition().y * PTM);
    },
    init: function () {},
    menuCloseCallback: function (sender) {},
    onTouchesBegan: function (touches, event) {},
    onTouchesMoved: function (touches, event) {},
    onTouchesEnded: function (touches, event) {},
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    }
});