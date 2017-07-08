<?php

namespace AppBundle\Form;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CustomPagesType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title',TextType::class,array(
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('Category',EntityType::class,array(
                'class' => 'AppBundle\Entity\CustomPageCategory',
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('content',TextareaType::class,array(
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('img',TextType::class,array(
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('permalink',HiddenType::class)
            ->add('dateCreated',HiddenType::class)
            ->add('dateUpdate',HiddenType::class)
            ->add('levelAccess',NumberType::class,array(
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('isActive')
            ->add('save',SubmitType::class,array(
                'label' => 'Publier la page',
                'attr' => array(
                    'class' => 'btn btn-success'
                )
        ));
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\CustomPages'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_custompages';
    }
}
