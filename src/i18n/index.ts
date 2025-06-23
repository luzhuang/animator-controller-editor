// 直接定义翻译资源，避免 JSON 导入问题
const enTranslations = {
  animation: {
    weight: 'Weight',
    trigger: 'Trigger',
    'default-value': 'Default Value',
    'select-parameter': 'Select Parameter',
    'select-script': 'Select Script',
    'state-machine-script': 'State Machine Script',
    'add-condition': 'Add Condition',
    conditions: 'Conditions',
    'no-conditions': 'No conditions',
    layers: 'Layers',
    parameters: 'Parameters',
    'no-parameters': 'No Parameters',
    'select-controller': 'Select an AnimatorController asset from Asset Panel to editing',
    condition: {
      if: 'If',
      'if-not': 'If Not',
      greater: 'Greater',
      less: 'Less',
      equals: 'Equals',
      'not-equal': 'Not Equal',
    },
    parameter: {
      name: 'Parameter Name',
      boolean: 'Boolean',
      number: 'Number',
      string: 'String',
      trigger: 'Trigger',
    },
    clip: {
      'an-clip': 'an AnimationClip',
      'tip-0': 'To begin animating {{0}} , add {{1}} to the Animator',
      'tip-1': 'To begin animating {{0}} , create an AnimatorController',
      'tip-2': 'To begin animating {{0}} , ',
      'tip-3': 'create an Animator and add {{0}}',
      'tip-4': 'create an Animator',
      create: 'Create',
      'create-animator-controller': 'Create AnimatorController',
      'add-target': 'Add ',
    },
    'animator-controller': {
      state: {
        name: 'Name',
        clip: 'Animation Clip',
        speed: 'Speed',
        validation: {
          'must-be-unique': 'State name must be unique',
        },
      },
      transition: {
        solo: 'Solo',
        mute: 'Mute',
        'has-exit-time': 'Has Exit Time',
        'fixed-duration': 'Fixed Duration',
        duration: 'Duration',
      },
    },
  },
  common: {
    remove: 'Remove',
    select: 'Select',
  },
  inspector: {
    'add-statemachine-script': 'Add StateMachine Script',
  },
}

const zhTranslations = {
  animation: {
    weight: '权重',
    trigger: '触发器',
    'default-value': '默认值',
    'select-parameter': '选择参数',
    'select-script': '选择脚本',
    'state-machine-script': '状态机脚本',
    'add-condition': '添加条件',
    conditions: '条件',
    'no-conditions': '无条件',
    layers: '图层',
    parameters: '参数',
    'no-parameters': '无参数',
    'select-controller': '从资产面板选择一个动画控制器资产进行编辑',
    condition: {
      if: '如果',
      'if-not': '如果不',
      greater: '大于',
      less: '小于',
      equals: '等于',
      'not-equal': '不等于',
    },
    parameter: {
      name: '参数名称',
      boolean: '布尔值',
      number: '数字',
      string: '字符串',
      trigger: '触发器',
    },
    clip: {
      'an-clip': '一个动画片段',
      'tip-0': '要开始为 {{0}} 制作动画，请将 {{1}} 添加到动画器',
      'tip-1': '要开始为 {{0}} 制作动画，请创建一个动画控制器',
      'tip-2': '要开始为 {{0}} 制作动画，',
      'tip-3': '创建一个动画器并添加 {{0}}',
      'tip-4': '创建一个动画器',
      create: '创建',
      'create-animator-controller': '创建动画控制器',
      'add-target': '添加 ',
    },
    'animator-controller': {
      state: {
        name: '名称',
        clip: '动画片段',
        speed: '速度',
        validation: {
          'must-be-unique': '状态名称必须唯一',
        },
      },
      transition: {
        solo: '独奏',
        mute: '静音',
        'has-exit-time': '有退出时间',
        'fixed-duration': '固定持续时间',
        duration: '持续时间',
      },
    },
  },
  common: {
    remove: '移除',
    select: '选择',
  },
  inspector: {
    'add-statemachine-script': '添加状态机脚本',
  },
}

const jaTranslations = {
  animation: {
    weight: '重み',
    trigger: 'トリガー',
    'default-value': 'デフォルト値',
    'select-parameter': 'パラメータを選択',
    'select-script': 'スクリプトを選択',
    'state-machine-script': 'ステートマシンスクリプト',
    'add-condition': '条件を追加',
    conditions: '条件',
    'no-conditions': '条件なし',
    layers: 'レイヤー',
    parameters: 'パラメータ',
    'no-parameters': 'パラメータなし',
    'select-controller': 'アセットパネルからアニメーターコントローラーアセットを選択して編集',
    condition: {
      if: 'もし',
      'if-not': 'もしでない',
      greater: 'より大きい',
      less: 'より小さい',
      equals: '等しい',
      'not-equal': '等しくない',
    },
    parameter: {
      name: 'パラメータ名',
      boolean: 'ブール値',
      number: '数値',
      string: '文字列',
      trigger: 'トリガー',
    },
    clip: {
      'an-clip': 'アニメーションクリップ',
      'tip-0': '{{0}} のアニメーションを開始するには、{{1}} をアニメーターに追加してください',
      'tip-1': '{{0}} のアニメーションを開始するには、アニメーターコントローラーを作成してください',
      'tip-2': '{{0}} のアニメーションを開始するには、',
      'tip-3': 'アニメーターを作成して {{0}} を追加してください',
      'tip-4': 'アニメーターを作成してください',
      create: '作成',
      'create-animator-controller': 'アニメーターコントローラーを作成',
      'add-target': '追加 ',
    },
    'animator-controller': {
      state: {
        name: '名前',
        clip: 'アニメーションクリップ',
        speed: '速度',
        validation: {
          'must-be-unique': 'ステート名は一意である必要があります',
        },
      },
      transition: {
        solo: 'ソロ',
        mute: 'ミュート',
        'has-exit-time': '終了時間あり',
        'fixed-duration': '固定持続時間',
        duration: '持続時間',
      },
    },
  },
  common: {
    remove: '削除',
    select: '選択',
  },
  inspector: {
    'add-statemachine-script': 'ステートマシンスクリプトを追加',
  },
}

export interface II18nResource {
  [key: string]: any
}

export interface II18nInstance {
  t(key: string, params?: any[]): string
  getCurrentLanguage(): string
  setLanguage(language: string): void
  getAvailableLanguages(): string[]
}

// 支持的语言
export const SUPPORTED_LANGUAGES = ['en', 'zh', 'ja'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// 翻译资源
export const translations: Record<SupportedLanguage, II18nResource> = {
  en: enTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
}

// 简单的翻译函数实现
class SimpleI18n implements II18nInstance {
  private currentLanguage: SupportedLanguage = 'en'

  constructor(language?: string) {
    if (language && SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
      this.currentLanguage = language as SupportedLanguage
    }
  }

  t(key: string, params?: any[]): string {
    const translation = this.getTranslation(key)

    if (!translation) {
      return key // 返回 key 作为降级方案
    }

    // 处理参数插值 {{0}}, {{1}} 等
    if (params && Array.isArray(params)) {
      return translation.replace(/\{\{(\d+)\}\}/g, (match: string, index: string) => {
        const paramIndex = parseInt(index)
        return params[paramIndex] !== undefined ? String(params[paramIndex]) : match
      })
    }

    return translation
  }

  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  setLanguage(language: string): void {
    if (SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
      this.currentLanguage = language as SupportedLanguage
    }
  }

  getAvailableLanguages(): string[] {
    return [...SUPPORTED_LANGUAGES]
  }

  private getTranslation(key: string): string | null {
    const keys = key.split('.')
    let current: any = translations[this.currentLanguage]

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // 尝试英文作为降级
        if (this.currentLanguage !== 'en') {
          current = translations.en
          for (const fallbackKey of keys) {
            if (current && typeof current === 'object' && fallbackKey in current) {
              current = current[fallbackKey]
            } else {
              return null
            }
          }
          return typeof current === 'string' ? current : null
        }
        return null
      }
    }

    return typeof current === 'string' ? current : null
  }
}

// 创建默认实例
export const createI18n = (language?: string): II18nInstance => {
  return new SimpleI18n(language)
}

// 导出默认实例（英文）
export const defaultI18n = createI18n('en')

// 兼容性导出
export { enTranslations, zhTranslations, jaTranslations }
