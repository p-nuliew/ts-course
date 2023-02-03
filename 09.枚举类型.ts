// 枚举: 表示一个被命名的常量集合。说通俗点就是这个常量能清楚的表达状态，而且带值

// 枚举值默认从0开始递增
{
  enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
  }

  const bool = Day.SUNDAY === 0 // true
}

// 枚举的常用方式

// 数字枚举
{
  enum Day {
    SUNDAY = 2,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
  }

  const bool = Day.MONDAY === 3 // true
}

// 字符串枚举
// 对于没有明确意义的数字枚举，字符串枚举更具备可读性
{
  enum Day {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
  }

  const bool = Day.SUNDAY === 'SUNDAY' // true
}

// 异构枚举（同时拥有数字和字符类型的成员）
// 鸡肋的存在
{
  enum Day {
    SUNDAY = 'SUNDAY',
    MONDAY = 2,
  }
}