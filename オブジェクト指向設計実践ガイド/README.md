# オブジェクト指向設計実践ガイド

<img width="516" src="https://user-images.githubusercontent.com/11070996/80845860-7f06b700-8c45-11ea-839c-6e93756be36a.png" />


# 2020/05/02

### 依存関係の管理

```ruby
class Wheel
  attr_reader :rim, :tire
  
  def initialize(rim, tire)
    @rim = rim
    @tire = tire
  end
  
  def diameter
    rim + (tire * 2) 
  end
end

class Gear
  attr_reader :chainring, :cog, :rim, :tire

  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire    
  end

  def gire_inches
    ratio * wheel.new(rim, tire).diameter
  end
end
```
