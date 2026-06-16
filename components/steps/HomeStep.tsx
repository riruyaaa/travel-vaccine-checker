import Button from "@/components/ui/Button";

export default function HomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl">✈️🩺</div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Vaccine Checker</h1>
        <p className="text-gray-500 leading-relaxed">
          여행 국가와 여행자 정보를 입력하면
          <br />
          출국 전 확인해야 할 예방접종, 예방약,
          <br />
          주의 감염병을 알려드려요.
        </p>
      </div>
      <div className="px-4 pb-6">
        <Button onClick={onStart}>여행 정보 입력 시작하기</Button>
        <p className="mt-3 text-center text-xs text-gray-400">
          이 앱은 참고용 도구이며, 실제 접종 여부는 의료진과 상담 후 결정해야 합니다.
        </p>
      </div>
    </div>
  );
}
