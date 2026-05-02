export default function DecisionCornerVines() {
  return (
    <div className="decision-corner-vines" aria-hidden="true">
      <svg
        viewBox="0 0 220 220"
        className="decision-corner-vines__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="vine-path vine-path--main"
          d="M210 6
             C206 30, 202 54, 194 74
             C186 95, 176 110, 160 126
             C144 142, 126 154, 112 167
             C101 177, 93 188, 88 202"
        />

        <path
          className="vine-path vine-path--branch-a"
          d="M164 118
             C154 112, 144 110, 136 112
             C126 114, 118 120, 112 130"
        />

        <path
          className="vine-path vine-path--branch-b"
          d="M132 150
             C122 146, 112 146, 103 150
             C95 154, 88 161, 84 170"
        />

        <path
          className="vine-leaf vine-leaf--a"
          d="M146 110
             C154 102, 163 101, 168 108
             C161 112, 153 114, 146 110Z"
        />

        <path
          className="vine-leaf vine-leaf--b"
          d="M111 129
             C118 121, 127 120, 132 127
             C125 132, 117 133, 111 129Z"
        />

        <path
          className="vine-leaf vine-leaf--c"
          d="M83 170
             C91 162, 100 162, 104 168
             C97 173, 89 174, 83 170Z"
        />
      </svg>
    </div>
  );
}