var DashedLineSprite = cc.Sprite.extend({

    _dashArray:null,
    _startX:null,
    _endX:null,
    _startY:null,
    _endY:null,

    ctor:function (startX,startY,endX,endY,dashArray)
    {
        this._super();
         this.initWithFile("res/crate.jpg");

        this._startX= startX * cc.CONTENT_SCALE_FACTOR();
        this._startY =startY * cc.CONTENT_SCALE_FACTOR() * -1;
        this._endX =  endX * cc.CONTENT_SCALE_FACTOR();
        this._endY =endY * cc.CONTENT_SCALE_FACTOR() * -1;
        if (!dashArray)
        {
            this._dashArray=[10,5];
        }
        else
        {
            this._dashArray=dashArray;
        }
    },
    draw:function () {
        //return;
        cc.renderContext.fillStyle = "rgba(255,255,255,1)";
        cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
        //alert(cc.renderContext);
        cc.renderContext.beginPath();

        var x=this._startX;
        var y=this._startY;
        var x2=this._endX;
        var y2=this._endY;

        if (dashLength==0)
        {
            dashLength = 0.001;
        } // Hack for Safari
        var dashCount = this._dashArray.length;

        cc.renderContext.moveTo(x , y );
        var dx = (x2-x), dy = (y2-y);
        var slope = dy/dx;
        var distRemaining = Math.sqrt( dx * dx + dy * dy );
        var dashIndex=0, draw=true;
        while (distRemaining>=0.1)
        {
            var dashLength = this._dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining)
            {
                dashLength = distRemaining;
            }
            var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
            if (dx<0)
            {
                xStep = -xStep;
            }
            x += xStep
            y += slope*xStep;
            if (draw)
            {
                cc.renderContext.lineTo(x ,y );
            }
            else
            {
                cc.renderContext.moveTo(x ,y );
            }
            distRemaining -= dashLength;
            draw = !draw;
        }
        cc.renderContext.closePath();
        cc.renderContext.stroke();
    }
});