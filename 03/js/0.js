function Rectangle(x, y, side, color)
{ 
	this.x = x;
    this.y = y;
    this.side = side;
    this.color = color;
    this.isSelected = false;
}

//保存画布上的所有盒子
var rectangles=[];

var c;
var ctx;

window.onload=function()
{
	c=document.getElementById("MyCanvas");
	ctx=c.getContext("2d");
	c.onmousedown = canvasClick;
	c.onmouseup = stopDragging;
	c.onmouseout = stopDragging;
	c.onmousemove = dragRectangle;
	window.onkeydown = processKey;
};

function guding()
{
	//绘制格子地图
	ctx.fillStyle="#795434";
	ctx.fillRect(200,0,200,200);
	ctx.fillRect(600,0,200,200);
	ctx.fillRect(400,200,200,200);
	ctx.fillRect(200,400,200,200);
	ctx.fillRect(600,400,200,200);
	
	ctx.fillStyle="#eee7c4";
	ctx.fillRect(400,0,200,200);
	ctx.fillRect(200,200,200,200);
	ctx.fillRect(600,200,200,200);
	ctx.fillRect(400,400,200,200);
	
	//写文字
	ctx.font="20px Showcard Gothic";
	// 渐变色
	var gradient1=ctx.createLinearGradient(60,30,130,0);
	gradient1.addColorStop("0","MistyRose");
	gradient1.addColorStop("0.5","Red");
	gradient1.addColorStop("1.0","MistyRose");
	
	var gradient2=ctx.createLinearGradient(860,30,930,0);
	gradient2.addColorStop("0","Cyan");
	gradient2.addColorStop("0.5","Blue");
	gradient2.addColorStop("1.0","Cyan");
	
	// 玩家1、2填充颜色
	ctx.fillStyle=gradient1;
	ctx.fillText("Player1",60,30,);
	ctx.fillStyle=gradient2;
	ctx.fillText("Player2",860,30,);
	
}

var f=0;

//存储每个盒子对象
function addRectangle()
{	
	var rectangle = new Rectangle(75,450,50,"red");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(75,510,50,"red");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(875,450,50,"blue");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(875,510,50,"blue");
	rectangles.push(rectangle);
	
	var rectangle = new Rectangle(60,270,80,"red");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(60,360,80,"red");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(860,270,80,"blue");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(860,360,80,"blue");
	rectangles.push(rectangle);
	
	var rectangle = new Rectangle(50,50,100,"red");
	rectangles.push(rectangle);			
	var rectangle = new Rectangle(50,160,100,"red");
	rectangles.push(rectangle);			
	var rectangle = new Rectangle(850,50,100,"blue");
	rectangles.push(rectangle);
	var rectangle = new Rectangle(850,160,100,"blue");
	rectangles.push(rectangle);
	
	drawRectangles();
	turn();

}

function clearCanvas() 
{
    // 去除所有盒子
    rectangles = [];
    // 重新绘制画布.
    drawRectangles();
	f=0;
}

//绘制盒子			
function drawRectangles() 
{
	// 清除画布，准备绘制
	ctx.clearRect(0, 0, c.width, c.height);
	//先绘制固定背景
	guding();
	
	// 遍历所有盒子
	for(var i=0; i<rectangles.length; i++) 
	{
		var rectangle = rectangles[i];
		
		// 绘制盒子
		if (rectangle.isSelected) 
		{
			ctx.fillStyle = rectangle.color;
			ctx.strokeStyle = "black";
			ctx.lineWidth = 3;
			ctx.strokeRect(rectangle.x,rectangle.y,rectangle.side,rectangle.side);
			ctx.fillRect(rectangle.x,rectangle.y,rectangle.side,rectangle.side);
		}
		else
		{
			ctx.fillStyle = rectangle.color;
			ctx.strokeStyle = "black";
			ctx.fillRect(rectangle.x,rectangle.y,rectangle.side,rectangle.side);
		}
    }
	return;
}
 
var previousSelectedRectangle;
			
//选中某一盒子
function canvasClick(e) 
{
	// 取得画布上被单击的点
	var clickX = e.pageX-c.offsetLeft;
	var clickY = e.pageY-c.offsetTop;
	
	// 查找被单击的盒子
	for(var i=rectangles.length-1; i>=0; i--) 
	{
		var rectangle = rectangles[i];
		// 判断这个点是否在盒子中
		if (clickX>rectangle.x && clickX<rectangle.x+rectangle.side && clickY>rectangle.y && clickY<rectangle.y+rectangle.side) 
		{
			// 清除之前选择的盒子
			if (previousSelectedRectangle != null) 
				previousSelectedRectangle.isSelected = false;
				
			previousSelectedRectangle = rectangle;
			
			//选择新盒子
			rectangle.isSelected = true;
			
			//使盒子可以进行拖拽
			isDragging = true;
		
			//更新显示
			drawRectangles();
			
			//停止搜索
			return;
		}
	}
}

var isDragging = false;
 
//停止拖拽
function stopDragging() 
{
	isDragging = false;
}

//对盒子进行拖拽
function dragRectangle(e) 
{
	// 判断盒子是否开始拖拽
	if (isDragging == true) 
	{
		// 判断拖拽对象是否存在
		if (previousSelectedRectangle != null) 
		{
			// 取得鼠标位置
			var x = e.pageX - c.offsetLeft;
			var y = e.pageY - c.offsetTop;
		
			// 将盒子移动到鼠标位置
			previousSelectedRectangle.x = x;
			previousSelectedRectangle.y = y;
			
			// 更新画布
			drawRectangles();
			processKey(e);
		}
    }
}

//判断每一个格子被哪方盒子占领
function judging()
{
	var a=[];
	var m;
	for(var i=0;i<9;i++)
	{
		var flag=0;
		//对每一个格子进行判断
		for(var j=0;j<rectangles.length;j++)
		{
			var rectangle = rectangles[j];
			//判断每一个盒子的左上和右下角是否在这个格子中
			if(rectangle.x >= 200+(i%3)*200 && rectangle.x <= 400+(i%3)*200 && rectangle.y >= 0+Math.floor(i/3)*200 && rectangle.y <= 200+Math.floor(i/3)*200 && rectangle.x+rectangle.side >= 200+(i%3)*200 && rectangle.x+rectangle.side <= 400+(i%3)*200 && rectangle.y+rectangle.side >= 0+Math.floor(i/3)*200 && rectangle.y+rectangle.side <= 200+Math.floor(i/3)*200)
			{
				if(flag==0)//格子里没有盒子
				{
					if(rectangle.color=="red")
						a[i]=1;
					else
						a[i]=-1;
					//记录盒子的下标
					m=j;
				}
				else//格子里有盒子，谁的大则谁占领格子
				{
					if(rectangle.side > rectangles[m].side)
					{
						if(rectangle.color=="red")
							a[i]=1;
						else
							a[i]=-1;
					}
				}
				flag=1;
			}
		}
	}
	if((a[0]+a[1]+a[2]==3)||(a[3]+a[4]+a[5]==3)||(a[6]+a[7]+a[8]==3)||(a[0]+a[3]+a[6]==3)||(a[1]+a[4]+a[7]==3)||(a[2]+a[5]+a[8]==3)||(a[0]+a[4]+a[8]==3)||(a[2]+a[4]+a[6]==3))
		alert("玩家1获胜!");
	else if(a[0]+a[1]+a[2]==-3||a[3]+a[4]+a[5]==-3||a[6]+a[7]+a[8]==-3||a[0]+a[3]+a[6]==-3||a[1]+a[4]+a[7]==-3||a[2]+a[5]+a[8]==-3||a[0]+a[4]+a[8]==-3||a[2]+a[4]+a[6]==-3)
		alert("玩家2获胜!");
}

function turn()//判断到哪一个玩家的轮次
{
	if(f==0)
	{
		f=1;
		//绘制三角形
		ctx.fillStyle="red";
		ctx.strokeStyle="black";
		ctx.lineWidth = 2;
		ctx.beginPath();//开始路径
		ctx.moveTo(30,20); //三角形，左顶点
		ctx.lineTo(30,40);//右顶点
		ctx.lineTo(45,30);//底部的点
		ctx.closePath();  //结束路径
		ctx.stroke();
		ctx.fill();
	}
	else if(f==1)
	{
		f=0;
		ctx.fillStyle="blue";
		ctx.strokeStyle="black";
		ctx.lineWidth = 2;
		ctx.beginPath();//开始路径
		ctx.moveTo(830,20); //三角形，左顶点
		ctx.lineTo(830,40);//右顶点
		ctx.lineTo(845,30);//底部的点
		ctx.closePath();  //结束路径
		ctx.stroke();
		ctx.fill();
	}
}

function processKey(e)
{
	if(e.keyCode==13)
	{
		judging();
		turn();
	}
}
