
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

/**
 * mock10000000条学生信息
 * CREATE TABLE students (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   name VARCHAR(20) NOT NULL,
 *   age INT NOT NULL,
 *   gender TINYINT NOT NULL COMMENT '1代表男性，2代表女性',
 *   student_id BIGINT UNSIGNED NOT NULL COMMENT '学号',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';
 */
public class MockStudentData {

    private static final int COUNT = 10000000; // 需要生成的学生信息数量

    public static void main(String[] args) {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(new File("D:\\WorkSpaces\\github\\java-core\\notes\\scripts\\out\\students.sql")));
            Random random = new Random();
            for (int i = 1; i <= COUNT; i++) {
                String name = randomName(random); // 生成随机姓名
                int age = randomAge(random); // 生成随机年龄
                int gender = randomGender(random); // 生成随机性别
                long studentId = randomStudentId(random); // 生成随机学号
                String sql = String.format("INSERT INTO students (name, age, gender, student_id) VALUES ('%s', %d, %d, %d);", name, age, gender, studentId); // 生成 SQL 语句
                writer.write(sql);
                writer.newLine();
            }
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String randomName(Random random) { // 生成随机姓名
        String[] surnameList = {"赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳", "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常", "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹", "姚", "邵", "湛", "汪", "祁", "禹", "狄", "贝", "臧", "储", "松", "富", "容", "屠", "融", "牟", "盖", "司", "车", "嵇", "华", "常", "晋", "欧阳", "商", "虞", "夏", "东方", "汉", "姒", "宁", "萨", "南宫", "聂", "赖", "子车", "姓", "乌", "太史"};
        String[] givenNameList = {"力", "明", "华", "强", "辉", "国", "建", "文", "铭", "桂", "涛", "洪", "新", "春", "秀", "珍", "英", "玲", "芳", "红", "娟", "云", "丽", "荣", "光", "超", "帆", "磊", "坤", "鹏", "江", "波", "琳", "雪", "刚", "伟", "洁", "健", "佳", "欣", "敏", "宇", "凯", "均", "凡", "慧", "宁", "成", "静", "琦", "毅", "峰", "龙", "翔", "宏", "苗", "忠", "冬", "雅", "娜", "志", "莉", "恒", "俊", "康", "海", "婷", "泽", "晶", "瑞", "睿", "卓", "亮", "欢", "靖", "畅", "民", "妍", "凌", "清", "淑", "进", "珂", "涵", "柏", "衡", "锐", "婧", "培", "宝", "映", "璐", "奇", "博", "芬", "依", "斌", "磊", "威", "芸", "彦", "文华", "梅", "雄", "韦", "恩", "栋", "瑶", "瑜", "超然", "廷", "贤", "飞", "俊杰", "俊强", "琪", "丹", "宝贝", "薇", "帅", "旭", "文泽", "鑫", "晓峰", "仙", "放", "小斌", "乐"};
        String surname = surnameList[random.nextInt(surnameList.length)];
        String givenName = givenNameList[random.nextInt(givenNameList.length)];
        return surname + givenName;
    }

    private static int randomAge(Random random) { // 生成随机年龄
        return random.nextInt(10) + 10; // 年龄在 10 - 19 岁之间
    }

    private static int randomGender(Random random) { // 生成随机性别
        return random.nextInt(2) + 1; // 1 代表男性，2 代表女性
    }

    private static long randomStudentId(Random random) { // 生成随机学号
        return ((long) (random.nextDouble() * 9_000_000_000L)) + 1_000_000_000L; // 学号的范围为 1,000,000,000 - 9,999,999,999
    }
}
