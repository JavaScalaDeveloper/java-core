## 1. ����
   �ڱ��̳��У����ǽ�̽�� org.springframework.web.bind.annotation ���е� Spring Web ע�͡�

## 2. @RequestMapping

�򵥵�˵��@RequestMapping ���@Controller ���ڲ�����������򷽷��� ������ʹ�����ã�

·����������������ƺ�ֵ������ӳ�䵽�ĸ� URL
���������ݵ� HTTP ����
params������ HTTP �����Ĵ��ڡ������ڻ�ֵ��������
headers������ HTTP ��ͷ�Ĵ��ڡ������ڻ�ֵ��������
���ģ��÷��������� HTTP ����������������Щý������
produces���÷��������� HTTP ��Ӧ������������Щý������
����һ���򵥵�ʾ����

````
@Controller
class VehicleController {

    @RequestMapping(value = "/vehicles/home", method = RequestMethod.GET)
    String home() {
        return "home";
    }
}
````
����������༶��Ӧ�ô�ע�ͣ����ǿ���Ϊ @Controller ���е����д�����򷽷��ṩĬ�����á� Ψһ�������� Spring ����ʹ�÷����������ø��ǵ��ḽ������·�����ֵ� URL��

���磬��������ú������Ч����һ���ģ�

````
@Controller
@RequestMapping(value = "/vehicles", method = RequestMethod.GET)
class VehicleController {

    @RequestMapping("/home")
    String home() {
        return "home";
    }
}
````

���⣬@GetMapping��@PostMapping��@PutMapping��@DeleteMapping ��@PatchMapping ��@RequestMapping �Ĳ�ͬ���壬��HTTP �����ѷֱ�����ΪGET��POST��PUT��DELETE ��PATCH��

��Щ�� Spring 4.3 �汾��ʼ���á�

## 3 @RequestBody

�����Ǽ���@RequestBody�������� HTTP ���������ӳ�䵽һ������

````
@PostMapping("/save")
void saveVehicle(@RequestBody Vehicle vehicle) {
// ...
}
````
�����л����Զ��ģ�ȡ����������������͡�

## 4 @PathVariable
������˵˵@PathVariable��

��ע��ָʾ���������󶨵� URI ģ������� ���ǿ���ʹ�� @RequestMapping ע��ָ�� URI ģ�壬��ʹ�� @PathVariable �����������󶨵�ģ�岿��֮һ��

���ǿ���ʹ�����ƻ����������ֵ������ʵ����һ�㣺

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable("id") long id) {
// ...
}
````
���ģ���в��ֵ������뷽��������������ƥ�䣬���ǾͲ�����ע����ָ������

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable long id) {
// ...
}
````
���⣬���ǿ���ͨ��������Ĳ�������Ϊ false ����·���������Ϊ��ѡ��

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable(required = false) long id) {
// ...
}
````
## 5. @RequestParam
   We use @RequestParam for accessing HTTP request parameters:
````
@RequestMapping
Vehicle getVehicleByParam(@RequestParam("id") long id) {
// ...
}
````
�������� @PathVariable ע����ͬ������ѡ�

������Щ����֮�⣬�� Spring �������з���û��ֵ��Ϊ��ֵʱ�����ǿ���ʹ�� @RequestParam ָ��ע��ֵ�� Ϊ�ˣ����Ǳ������� defaultValue ������

�ṩĬ��ֵ��ʽ���� required Ϊ false��
````
@RequestMapping("/buy")
Car buyCar(@RequestParam(defaultValue = "5") int seatCount) {
// ...
}
````
���˲���֮�⣬���ǻ����Է������� HTTP ���󲿷֣�cookie �ͱ�ͷ�� 

���ǿ��Էֱ�ʹ��ע��@CookieValue ��@RequestHeader ���������ǡ�


## 6. Response Handling Annotations
�ڽ������Ĳ����У����ǽ������� Spring MVC �в��� HTTP ��Ӧ�����ע�͡�

### 6.1 @ResponseBody
���������@ResponseBody �����������򷽷���Spring �Ὣ�����Ľ����Ϊ��Ӧ����

````
@ResponseBody
@RequestMapping("/hello")
String hello() {
return "Hello World!";
}
````
������������ע����ע�� @Controller �࣬������������򷽷�����ʹ������

### 6.2 @ExceptionHandler

ʹ�ô�ע�ͣ����ǿ�������һ���Զ����������򷽷��� ����������򷽷��׳��κ�ָ�����쳣ʱ��Spring ���ô˷�����

������쳣������Ϊ�������ݸ�������
````
@ExceptionHandler(IllegalArgumentException.class)
void onIllegalArgumentException(IllegalArgumentException exception) {
// ...
}
````

### 6.3 @ResponseStatus
�������ʹ�ô�ע�Ͷ���������򷽷�����ע�ͣ������ָ����Ӧ������ HTTP ״̬�� ���ǿ���ʹ�� code ����������� value ����������״̬���롣

���⣬���ǿ���ʹ�� reason �����ṩԭ��

����Ҳ���Խ�����@ExceptionHandler һ��ʹ�ã�

@ExceptionHandler(IllegalArgumentException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
void onIllegalArgumentException(IllegalArgumentException exception) {
// ...
}

�й� HTTP ��Ӧ״̬�ĸ�����Ϣ������ʱ��ġ�

## 7 ���� Webע��
һЩע�Ͳ�ֱ�ӹ��� HTTP �������Ӧ�� �ڽ������Ĳ����У����ǽ���������ġ�

### 7.1 @Controller
���ǿ���ʹ��@Controller ����һ��Spring MVC �������� �йظ�����Ϣ����������ǹ��� Spring Bean Annotations �����¡�

### 7.2 @RestController
@RestController �����@Controller ��@ResponseBody��

��ˣ����������ǵ�Ч�ģ�

````
@Controller
@ResponseBody
class VehicleRestController {
// ...
}
````

````
@RestController
class VehicleRestController {
// ...
}
````
### 7.3 @ModelAttribute
ͨ�����ע�⣬���ǿ���ͨ���ṩģ�ͼ��������Ѿ������� MVC @Controller ģ���е�Ԫ�أ�

````
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute("vehicle") Vehicle vehicleInModel) {
// ...
}
````
��@PathVariable ��@RequestParam һ�����������������ͬ�����ƣ����ǲ���ָ��ģ�ͼ���

````
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute Vehicle vehicle) {
// ...
}
````
���⣬@ModelAttribute����һ����;�������������ע��һ��������Spring���Զ��������ķ���ֵ��ӵ�ģ���У�

````
@ModelAttribute("vehicle")
Vehicle getVehicle() {
// ...
}
````
����ǰһ�������ǲ���ָ��ģ�ͼ���Spring Ĭ��ʹ�÷��������ƣ�
````
@ModelAttribute
Vehicle vehicle() {
// ...
}
````
�� Spring ������������򷽷�֮ǰ����������������� @ModelAttribute ע�͵ķ�����

�й� @ModelAttribute �ĸ�����Ϣ������ı��ġ�

### 7.4 @CrossOrigin
@CrossOrigin Ϊ��ע�͵���������򷽷����ÿ���ͨ�ţ�

````
@CrossOrigin
@RequestMapping("/hello")
String hello() {
return "Hello World!";
}
````
��������������һ���࣬�����������е�������������򷽷���

���ǿ���ʹ�ô�ע�͵Ĳ���΢�� CORS ��Ϊ��

�й���ϸ��Ϣ������ʱ��ġ�


# �ο�����
https://www.baeldung.com/spring-annotations
