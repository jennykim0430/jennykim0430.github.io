var t1 = new TimelineMax({
    repeat: -1
  }),
  c1 = $('#candle-1'),
  c2 = $('#candle-2'),

  // amount of candles on the screen//
  f = c1.find('.flame'),
  m = c2.find('.mouth'),

  // category of flame and a mouth of taller candle//
  fTween = TweenMax.to(f, 0.3, {
    width: 27,

  //starting size of a candle?//
    backgroundColor: 'yellow',
    repeat: -1,
    yoyo: true
  });

  //background color//


t1.add(
    [
      TweenMax.to(c2, 0.1, {
        scale: 1.2,
        transformOrigin: "center bottom"
      }),
      TweenMax.to(m, 0.7, {
        scale: 5,
        transformOrigin: "center center",
        force3D: false
      })
    ]

  //scale of taller candle//
  ).add(
    [
      TweenMax.to(c2, 0.7, {
        scale: 1,
        transformOrigin: "center bottom"
      }),
      TweenMax.to(m, 0.7, {
        scale: 1.1,
        transformOrigin: "center center",
        force3D: false
      })
    ]

    //additional scale of taller candle//

  ).to(m, 1, {
    width: 100,
    borderRadius: 0,
    x: -300,
    autoAlpha: 0
  }, 1.2)
  .to(c1, 0.3, {
    x: -3,
    repeat: 4,
    yoyo: true
  }, 1.3)
  .to([f,'.flame-halo'], 0.1, {
    autoAlpha: 0,
    scale: 0.5
  }, 1.3)

  // speed of wind flow coming out from the taller candle//

  .add([
    TweenMax.to(c1, 1, {
      height: "-=20",
      scaleX: 1.2,
//scale of smaller candle//
      backgroundColor: "#FFCCCC",
      transformOrigin: "center center"
    }),

  //size of the background and place where the candle is//
    TweenMax.to(c1.find('.eye'), 1, {
      height: "-=5"
    }),
  ])

  //scale of fire on the smaller candle, after when the taller candle blows//
  .to(c1, 0.2, {
    x: "+=20",
    repeat: 4,
    yoyo: true
  }).add(
    [
//I'm not sure about this ;(//
      TweenMax.to(f, 0.2, {
        autoAlpha: 1,
        scale: 1.2
      })

    ]
  ).add(
    [
      TweenMax.to(c1, 0.5, {
        height: "+=20",
        scaleX: 1,
        x: "-=20",
      })

      //I'm not sure about this ;(//

    ]
  )