import { NodeEditor, ClassicPreset } from "rete";
import {
  AreaPlugin,
  AreaExtensions // 
 } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { VuePlugin, Presets } from "rete-vue-plugin";

export async function createEditor(container) {

  const editor = new NodeEditor();
  const area = new AreaPlugin(container); // 캔버스 영역을 관리
  const connection = new ConnectionPlugin();
  const render = new VuePlugin();

  /* 노드 선택 기능 (노란색으로 변경됨) */
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl() // 여러 노드 선택 가능 (Ctrl + 마우스 좌클릭)
  });

  render.addPreset(Presets.classic.setup());

  /* Connection: 노드간 연결 객체를 관리하는 객체 */
  connection.addPreset(ConnectionPresets.classic.setup()); // 기본 연결 스타일 preset 등록

  editor.use(area);
  area.use(connection);
  area.use(render);

  /* [노드 순서 정렬]: 노드가 드래그이동 등으로 겹쳐질경우 항상 최근에 선택/드래그한 노드가 위에 표시되도록 하는 기능 */
  AreaExtensions.simpleNodesOrder(area);

  const socket = new ClassicPreset.Socket("socket");

  /* [a노드 생성 및 입출력 socket 설정]: 1. 노드 생성 / 2. InputControl 등록 / 3. socket 등록 */
  const a = new ClassicPreset.Node("A"); // 1. 노드 생성
  a.addControl( // 2. InputControl 생성 및 등록
    "a",
    new ClassicPreset.InputControl("text", { initial: "hello" })
  );
  a.addOutput("a", new ClassicPreset.Output(socket)); // 3. Output Socket 등록
  await editor.addNode(a); // editor에 노드 등록과 동시에 렌더링

  /* [B노드  생성 및 입출력 socket 설정]: 1. 노드 생성 / 2. InputControl 등록 / 3. socket 등록 */
  const b = new ClassicPreset.Node("B"); // 1. 노드 생성
  b.addControl( // 2. InputControl 생성 및 등록
    "b",
    new ClassicPreset.InputControl("text", { initial: "hello" })
  );
  b.addInput("b", new ClassicPreset.Input(socket)); // 3. Input Socket 등록
  await editor.addNode(b); // editor에 노드 등록과 동시에 렌더링

  /* [B노드 기본좌표 설정]: 설정하지 않으면 a노드와 동일한 위치에 겹쳐지게 됨 */
  await area.translate(b.id, { x: 320, y: 0 });

  /* [a, b 노드간 연결] */
  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

  /* 지정한 노드들이 화면 안에 보이도록 줌과 위치를 자동 조정 */
  AreaExtensions.zoomAt(area, editor.getNodes());

  return () => area.destroy();
}