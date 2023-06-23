import React, { ButtonHTMLAttributes, ReactNode } from 'react';

// jsのイベント発生する瞬間をtsで記入する必要がある
const Button = ({
  children, //childrenを取り出す
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => {
  // 関数を展開する時{}を使うから{...props}としてある
  return (
    <button
      className="px-4 py-2 rounded-full bg-blue-500 text-white"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

//  ButtonHTMLAttributes<HTMLButtonElement>は定義されていないpropsを除外する
//   children: ReactNode;は中になにも文字が入っていない時にエラーを出す
