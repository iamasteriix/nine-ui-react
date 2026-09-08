import { SxStyles } from "@/api";
import { Text } from "@/components";
import { View } from "@/primitives";
import * as Icons from "@lucidjs/icons";
import { useState } from "react";


const IconsList = Object.entries(Icons);


export const PlayGround = () => {
  const [variantName, setvariantName] = useState<'monochrome' | 'duotone'>('monochrome');
  const [isSolid, setIsSolid] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '3rem',
          padding: '.5rem',
          width: 'min-content',
          backgroundColor: 'var(--colors-bgSubtle)',
          borderRadius: 'var(--shape-radiusXl)',
        }}
      >
        {
          [
            { key: 'monochrome', label: 'Monochrome' },
            { key: 'duotone', label: 'Duotone' },
          ].map(({ key, label }) => (
            <button
              key={ key }
              style={{
                padding: 'var(--spacing-space1) var(--spacing-space3)',
                backgroundColor: variantName === key ? 'var(--colors-primarySubtle)' : 'inherit',
                border: 'none',
                borderRadius: 'var(--shape-radiusXl)',
                fontSize: 'var(--typography-textBase)',
                fontWeight: 'var(--typography-weightSemibold)',
                color: variantName === key ? 'var(--colors-textInverse)' : 'var(--colors-textPrimary)',
              }}
              onClick={ () => setvariantName(key as 'monochrome' | 'duotone') }
            >
              <p>{ label }</p>
            </button>
          ))
        }
        <button
          style={{
            marginLeft: 'var(--spacing-space4)',
            padding: 'var(--spacing-space1) var(--spacing-space3)',
            backgroundColor: isSolid ? 'var(--colors-primarySubtle)' : 'var(--colors-bgElevated)',
            border: 'none',
            borderRadius: 'var(--shape-radiusXl)',
            fontSize: 'var(--typography-textBase)',
            fontWeight: 'var(--typography-weightSemibold)',
            color: isSolid ? 'var(--colors-textInverse)' : 'var(--colors-textPrimary)',
          }}
          onClick={ () => setIsSolid(!isSolid) }
        >
          <p>Solid</p>
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(99px, 1fr))',
          gap: 16,
        }}
      >
        {
          IconsList.map(([name, Icon]) => (
            <View
              variant={ variants.view.pill }
              sx={ styles.pill }
            >
              <Icon
                variant={ variantName }
                size='24px'
                fill={ ['var(--colors-primary)', 'var(--colors-accent)'] }
                solid={ isSolid }
              />
              <Text variant={ variants.text.label }>{ name }</Text>
            </View>
          ))
        }
      </div>
    </div>
  );
}


const variants = SxStyles.variants({
  view: {
    pill: {
      name: 'flat',
      fill: 'subtle',
      elevation: 'level-1',
    },
  },
  text: {
    label: { name: 'caption' },
  },
});

const styles = SxStyles.create({
  pill: {
    alignItems: 'center',
    padding: 'space-2',
    borderRadius: 'lg',
  },
});
